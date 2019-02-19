from django.db import models
from polymorphic.models import PolymorphicModel

from random import random
from math import ceil

from debug.logger import Logger
from actions.damage_types import DAMAGE_TYPE_CHOICES
from actions.stat_choices import STAT_CHOICES
from actions.aoe_choices import AOE_CHOICES, AOE_PERCENT_HIT_MAP

from dice.models import Dice
from effects.models import Effect
from utils.dice import d20, calc_roll


class Action(PolymorphicModel):
    name = models.CharField(max_length=128, unique=True)
    action_type = models.CharField(max_length=32)
    recharge_percentile = models.FloatField(default=0.0)
    stat_bonus = models.CharField(
        choices=STAT_CHOICES, max_length=12, null=True)
    is_legendary = models.BooleanField(default=False)
    legendary_action_cost = models.PositiveSmallIntegerField(default=0)
    effects = models.ManyToManyField(Effect, through="ActionToEffect")

    def save(self, *args, **kwargs):
        if self.is_legendary and self.legendary_action_cost == 0:
            raise RuntimeError("An action cannot be legendary and have 0 legendary cost")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def instantiate(self, num_available=-1):
        self.ready = True
        self.logger = Logger()
        self.num_available = num_available
        self.instantiated_effects = list(self.effects.all())
        return self

    def try_recharge(self):
        percentile = random()
        if percentile >= self.recharge_percentile:
            self.ready = True

    def jsonify(self, current_info={}):
        default_info = {
            "label": self.name,
            "value": self.name,
            "name": self.name,
            "actionEffects": [e.name for e in self.effects.all()],
        }
        return dict(**current_info, **default_info)


class ActionToEffect(models.Model):
    action = models.ForeignKey(Action, on_delete=models.CASCADE)
    effect = models.ForeignKey(Effect, on_delete=models.CASCADE)


class SingleAttack(Action):
    """
    Notes:
        multi_attack: an example of this is scorching ray, which does the same
            attack 3 times. Could model as a ComboAttack, but this leaves
            another option.
        is_aoe and aoe_type: Must co-exist. The save() definition checks this
    """
    multi_attack = models.SmallIntegerField(default=1)
    is_aoe = models.BooleanField(default=False)
    aoe_type = models.CharField(choices=AOE_CHOICES, max_length=64, null=True)
    damage_type = models.CharField(choices=DAMAGE_TYPE_CHOICES, max_length=32)
    save_stat = models.CharField(choices=STAT_CHOICES, null=True, max_length=16)
    save_dc = models.SmallIntegerField(null=True)
    damage_dice = models.ManyToManyField(Dice, through='SingleAttackDice')
    bonus_to_hit = models.SmallIntegerField(default=0)
    bonus_to_damage = models.SmallIntegerField(default=0)

    def save(self, *args, **kwargs):
        if self.is_aoe and self.aoe_type is None:
            raise RuntimeError("Cannot have an aoe attack without an aoe type")
        super().save(*args, **kwargs)

    def instantiate(self, num_available=-1):
        self.dice = dict(SingleAttackDice.objects.filter(
            attack=self).values_list(
            'dice__num_sides', 'num_dice'))
        return super().instantiate(num_available=num_available)

    def do_damage(self, attacker, target):
        """ Called to test whether an attack hits and then applies the damage.
        :param attacker: The creature using the attack
        :param target: The creature receiving the attack
        :return: None, damage is applied on the target object
        """
        raise NotImplementedError("do_damage is not implemented on this class!")

    def calc_expected_damage(self, num_enemies=1):
        expected_enemies_hit = self.calc_expected_enemies_hit(num_enemies)
        return expected_enemies_hit * sum([
            n_dice * (max_roll / 2.0 + 0.5) for n_dice, max_roll in
            SingleAttackDice.objects.filter(attack=self).values_list(
                'dice__num_sides', 'num_dice'
            )])

    def calc_expected_enemies_hit(self, num_enemies):
        num_targets_hit = self.multi_attack
        if self.is_aoe:
            num_targets_hit = AOE_PERCENT_HIT_MAP[self.aoe_type](num_enemies)
        return num_targets_hit

    def apply_effects(self, target):
        [effect.apply(target) for effect in self.instantiated_effects]

    def log_attack(self, attacker, target, damage):
        self.logger.log_action("{0}{1} took {2} damage from {3} ({4})".format(
            "Legendary action - " if self.is_legendary else "",
            target.name, damage, self.name, attacker.name))

    def jsonify(self, current_info={}):
        attack_info = {
            "expDamage": self.calc_expected_damage()
        }
        return super().jsonify(attack_info)


class SingleAttackDice(models.Model):
    attack = models.ForeignKey(SingleAttack, on_delete=models.CASCADE)
    dice = models.ForeignKey(Dice, on_delete=models.PROTECT)
    num_dice = models.SmallIntegerField(default=1)


class SingleAttackEffect(models.Model):
    attack = models.ForeignKey(SingleAttack, on_delete=models.CASCADE)
    effect = models.ForeignKey(Effect, on_delete=models.CASCADE)


class PhysicalSingleAttack(SingleAttack):
    def save(self, *args, **kwargs):
        self.action_type = "Attack"
        super().save(*args, **kwargs)

    def do_damage(self, attacker, target):
        damage = 0
        hit_check = d20() + attacker.saves[self.stat_bonus] + self.bonus_to_hit + attacker.proficiency
        if hit_check >= target.ac:
            damage = calc_roll(self.dice) + attacker.saves[self.stat_bonus] + self.bonus_to_damage

        target.take_damage(damage, self.damage_type)
        self.log_attack(attacker, target, damage)


class SpellSingleAttack(SingleAttack):
    """
    Either a saving throw from target or test of hit chance to targets AC
    Chance to hit is d20 + relevant stat bonus + bonus to damage
    A saving throw is a d20 + relevant stat bonus compared to spell DC
    """

    def save(self, *args, **kwargs):
        self.action_type = "Attack"
        super().save(*args, **kwargs)

    def do_damage(self, attacker, target):
        damage = 0
        if self.stat_bonus is not None:
            attack_bonus = attacker.proficiency + \
                           attacker.saves[self.stat_bonus] if self.stat_bonus else 0
            hit_check = d20() + attack_bonus + self.bonus_to_hit
            if hit_check >= attacker.ac:
                damage = calc_roll(self.dice) + self.bonus_to_damage
        else:
            save_check = d20() + target.saves[self.save_stat]
            if save_check <= self.save_dc:
                damage = calc_roll(self.dice) + self.bonus_to_damage

        target.take_damage(damage, self.damage_type)
        self.log_attack(attacker, target, damage)


class SpellSave(SingleAttack):
    """
    Spell saves are attacks which do full damage on a failed save or half
    as much on a successful save.
    """

    def save(self, *args, **kwargs):
        self.action_type = "Attack"
        super().save(*args, **kwargs)

    def do_damage(self, attacker, target):
        save_check = d20() + target.saves[self.save_stat]
        damage = calc_roll(self.dice)
        if save_check > self.save_dc:
            damage = ceil(damage / 2.0)

        target.take_damage(damage, self.damage_type)

        self.log_attack(attacker, target, damage)


class Heal(Action):
    heal_dice = models.ManyToManyField(Dice, through='HealDice')
    num_targets = models.SmallIntegerField()

    def save(self, *args, **kwargs):
        self.action_type = "Heal"
        super().save(*args, **kwargs)

    def instantiate(self, num_available=-1):
        self.dice = dict(HealDice.objects.filter(
            heal=self).values_list(
            'dice__num_sides', 'num_dice'))
        return super().instantiate(num_available=num_available)

    def log_heal(self, healed, new_health, healer):
        self.logger.log_action("{0} healed from {1} to {2} ({3})".format(
            healed.name, healed.hp, new_health, healer.name))

    def do_heal(self, healer, healed):
        health_up = calc_roll(self.heal_dice) + (
            healer.saves[self.stat_bonus] if self.stat_bonus else 0)
        new_health = min(healed.hp + health_up, healed.max_hp)
        self.log_heal(healed, new_health, healer)
        healed.hp = new_health

    def calc_expected_heal(self):
        return self.num_targets * sum([
            n_dice * (max_roll / 2.0 + 0.5) for n_dice, max_roll in
            HealDice.objects.filter(attack=self).values_list(
                'dice__num_sides', 'num_dice'
            )])

    def jsonify(self, current_info={}):
        attack_info = {
            "expHeal": self.calc_expected_heal()
        }
        return super().jsonify(attack_info)


class HealDice(models.Model):
    heal = models.ForeignKey(Heal, on_delete=models.CASCADE)
    dice = models.ForeignKey(Dice, on_delete=models.PROTECT)
    num_dice = models.SmallIntegerField()


class ComboAttack(Action):
    attacks = models.ManyToManyField(SingleAttack, through="ComboAttackComponents")

    def save(self, *args, **kwargs):
        self.action_type = "Attack"
        super().save(*args, **kwargs)

    def instantiate(self, num_available=-1):
        self.ready = True
        self.logger = Logger()
        self.num_available = num_available
        self.instantiated_attacks = [a.instantiate() for a in self.attacks.all()]
        return self

    def calc_expected_damage(self, num_enemies=1):
        total_expected_damage = 0
        for attack in self.instantiated_attacks:
            total_expected_damage += attack.calc_expected_damage(num_enemies)
        return total_expected_damage

    def do_damage(self, attacker, target):
        for attack in self.instantiated_attacks:
            attack.do_damage(attacker, target)

    def apply_effects(self, target):
        for attack in self.instantiated_attacks:
            attack.apply_effects(target)

    def jsonify(self, current_info={}):
        attack_info = {
            "expDamage": self.calc_expected_damage()
        }
        return super().jsonify(attack_info)


class ComboAttackComponents(models.Model):
    combo_attack = models.ForeignKey(ComboAttack, on_delete=models.CASCADE)
    single_attack = models.ForeignKey(SingleAttack, on_delete=models.CASCADE)

