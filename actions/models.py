from django.db import models

from random import random
from math import ceil

from debug.logger import Logger
from actions.damage_types import DAMAGE_TYPE_CHOICES
from actions.stat_choices import STAT_CHOICES

from dice.models import Dice
from effects.models import Effect
from utils.dice import d20, calc_roll


class Action(models.Model):
    name = models.CharField(max_length=128, unique=True)
    action_type = models.CharField(max_length=32)
    recharge_percentile = models.FloatField(default=0.0)
    stat_bones = models.CharField(
        choices=STAT_CHOICES, max_length=12, null=True)
    effects = models.ManyToManyField(Effect, through="ActionToEffect")

    def instantiate(self, num_available=-1):
        self.ready = True
        self.logger = Logger()
        self.num_available = num_available

    def try_recharge(self):
        percentile = random()
        if percentile >= self.recharge_percentile:
            self.ready = True


class ActionToEffect(models.Model):
    action = models.ForeignKey(Action, on_delete=models.CASCADE)
    effect = models.ForeignKey(Effect, on_delete=models.CASCADE)


class Attack(Action):
    action_type = "Attack"
    multi_attack = models.SmallIntegerField()
    is_aoe = models.BooleanField(default=False)


class SingleAttack(Attack):
    damage_type = models.CharField(choices=DAMAGE_TYPE_CHOICES, max_length=32)
    save_stat = models.CharField(choices=STAT_CHOICES, null=True, max_length=16)
    save_dc = models.SmallIntegerField(null=True)
    damage_dice = models.ManyToManyField(Dice, through='SingleAttackDice')
    bonus_to_hit = models.SmallIntegerField()
    bonus_to_damage = models.SmallIntegerField()

    def do_damage(self, attacker, target):
        """ Called to test whether an attack hits and then applies the damage.
        :param attacker: The creature using the attack
        :param target: The creature receiving the attack
        :return: None, damage is applied on the target object
        """
        raise NotImplementedError("do_damage is not implemented on this class!")

    def calc_expected_damage(self):
        return self.multi_attack * sum([n_dice * (max_roll / 2.0 + 0.5) for
                                        n_dice, max_roll in self.damage_dice.all()])

    def apply_effects(self, target):
        # TODO: Handle effects_temp
        [effect.apply(target) for effect in self.effects.all()]

    def log_attack(self, attacker, target, damage):
        self.logger.log_action("{0} took {1} damage from {2} ({3})".format(
            target.name, damage, self.name, attacker.name))


class SingleAttackDice(models.Model):
    attack = models.ForeignKey(SingleAttack, on_delete=models.CASCADE)
    dice = models.ForeignKey(Dice, on_delete=models.PROTECT)
    num_dice = models.SmallIntegerField(default=1)


class SingleAttackEffect(models.Model):
    attack = models.ForeignKey(SingleAttack, on_delete=models.CASCADE)
    effect = models.ForeignKey(Effect, on_delete=models.CASCADE)


class PhysicalSingleAttack(SingleAttack):
    action_type = "Single target physical attack"

    def do_damage(self, attacker, target):
        damage = 0
        hit_check = d20() + attacker.saves[self.stat_bonus] + self.bonus_to_hit + attacker.proficiency
        if hit_check >= target.ac:
            damage = calc_roll(self.damage_dice) + attacker.saves[self.stat_bonus] + self.bonus_to_damage

        target.take_damage(damage, self.damage_type)
        self.log_attack(attacker, target, damage)


class SpellSingleAttack(SingleAttack):
    """
    Either a saving throw from target or test of hit chance to targets AC
    Chance to hit is d20 + relevant stat bonus + bonus to damage
    A saving throw is a d20 + relevant stat bonus compared to spell DC
    """

    action_type = "Single target spell attack"

    def do_damage(self, attacker, target):
        damage = 0
        if self.stat_bonus is not None:
            attack_bonus = attacker.proficiency + \
                           attacker.saves[self.stat_bonus] if self.stat_bonus else 0
            hit_check = d20() + attack_bonus + self.bonus_to_hit
            if hit_check >= attacker.ac:
                damage = calc_roll(self.damage_dice) + self.bonus_to_damage
        else:
            save_check = d20() + target.saves[self.save_stat]
            if save_check <= self.save_dc:
                damage = calc_roll(self.damage_dice) + self.bonus_to_damage

        target.take_damage(damage, self.damage_type)
        self.log_attack(attacker, target, damage)


class SpellSave(SingleAttack):
    """
    Spell saves are attacks which do full damage on a failed save or half
    as much on a successful save.
    """

    action_type = "Spell attack requiring save"

    def do_damage(self, attacker, target):
        save_check = d20() + target.saves[self.save_stat]
        damage = calc_roll(self.damage_dice)
        if save_check > self.save_dc:
            damage = ceil(damage / 2.0)

        target.take_damage(damage, self.damage_type)

        self.log_attack(attacker, target, damage)


class Heal(Action):
    action_type = "Heal"
    heal_dice = models.ManyToManyField(Dice, through='HealDice')
    num_targets = models.SmallIntegerField()

    def log_heal(self, healed, new_health, healer):
        self.logger.log_action("{0} healed from {1} to {2} ({3})".format(
            healed.name, healed.hp, new_health, healer.name))

    def do_heal(self, healer, healed):
        health_up = calc_roll(self.heal_dice) + (
            healer.saves[self.stat_bonus] if self.stat_bonus else 0)
        new_health = min(healed.hp + health_up, healed.max_hp)
        self.log_heal(healed, new_health, healer)
        healed.hp = new_health


class HealDice(models.Model):
    heal = models.ForeignKey(Heal, on_delete=models.CASCADE)
    dice = models.ForeignKey(Dice, on_delete=models.PROTECT)
    num_dice = models.SmallIntegerField()


class ComboAttack(models.Model):
    attacks = models.ManyToManyField(SingleAttack, through="ComboAttackComponents")
    recharge_percentile = models.FloatField(default=0.0)
    action_type = "Combo attack"

    def instantiate(self, num_available=-1):
        self.ready = True
        self.logger = Logger()
        self.num_available = num_available

    def calc_expected_damage(self):
        total_expected_damage = 0
        for attack in self.attacks.all():
            total_expected_damage += attack.calc_expected_damage()
        return total_expected_damage

    def do_damage(self, attacker, target):
        for attack in self.attacks.all():
            attack.do_damage(attacker, target)

    def apply_effects(self, target):
        for attack in self.attacks.all():
            attack.apply_effects(target)


class ComboAttackComponents(models.Model):
    combo_attack = models.ForeignKey(ComboAttack, on_delete=models.CASCADE)
    single_attack = models.ForeignKey(SingleAttack, on_delete=models.CASCADE)

