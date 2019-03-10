from django.db import models

from dice.models import Dice
from actions.stat_choices import STAT_CHOICES

from utils.dice import calc_roll, d20
from debug.logger import Logger


class Effect(models.Model):
    name = models.CharField(max_length=128, unique=True)
    effect_type = models.CharField(max_length=32)
    description = models.TextField(null=True)

    def instantiate(self, turns_left):
        self.logger = Logger()
        self.turns_left = turns_left

    def apply(self, creature):
        """ How does this affect get applied """
        raise RuntimeError("apply() is not implemented for {}!".format(self.name))

    def on_turn_start(self, creature):
        """ What this effect does at the start of a turn """
        raise RuntimeError("on_turn_start() is not implemented for {}!".format(self.name))

    def on_turn_end(self, creature):
        """ What this effect does at the end of a turn.

            This method should implement some way for the effect to be removed.
        """
        raise RuntimeError("on_turn_end() is not implemented for {}!".format(self.name))

    def jsonify(self):
        return {
            # Front end json entries
            "label": self.name,
            "value": self.name,
            # Regular entries
            "name": self.name,
            "type": self.effect_type,
            "description": self.description
        }


class DOTEffect(Effect):
    dice = models.ManyToManyField(Dice, through='DOTDice')
    save_dc = models.SmallIntegerField()
    save_stat = models.CharField(choices=STAT_CHOICES, null=True, max_length=16)

    def save(self, *args, **kwargs):
        self.description = "{} damage per turn with a DC {} {} save".format(
            self.format_dice(), self.save_dc, self.save_stat)
        self.effect_type = "DOT Effect"
        super().save(*args, **kwargs)

    def format_dice(self):
        dice = DOTDice.objects.filter(effect=self)
        return "+".join(["{}d{}".format(nsides, num_dice)
                         for nsides, num_dice in dice.values_list(
                'dice__num_sides', 'num_dice')])

    def apply(self, creature):
        save_attempt = d20() + creature.saves[self.save_stat]
        if save_attempt >= self.save_dc:
            self.logger.log_action(
                "{0} saved from {1}".format(creature.name, self.name))
            return
        else:
            creature.applied_effects.append(self)

    def on_turn_start(self, creature):
        total = calc_roll(self.dice)
        self.logger.log_action("{0} suffered {1} for {2} damage".format(creature.name, self.name, total))
        creature.hp -= total
        self.turns_left -= 1

    def on_turn_end(self, creature):
        save_attempt = d20() + creature.saves[self.save['stat']]
        if save_attempt >= self.save['DC']:
            self.logger.log_action(
                "{0} saved from {1}".format(creature.name, self.name))
            return False
        else:
            self.logger.log_action(
                "{0} failed to save from {1}".format(creature.name, self.name))
            return True


class DOTDice(models.Model):
    dice = models.ForeignKey(Dice, on_delete=models.PROTECT)
    effect = models.ForeignKey(DOTEffect, on_delete=models.CASCADE)
    num_dice = models.SmallIntegerField()


class PermanentTypeResistance(Effect):

    def save(self, *args, **kwargs):
        self.effect_type = "Type Resistance"
        super().save(*args, **kwargs)

    def apply(self, creature):
        creature.applied_effects.append(self)

    def on_turn_start(self, creature):
        pass

    def on_turn_end(self, creature):
        return True


class StunEffect(Effect):
    save_dc = models.SmallIntegerField()
    save_stat = models.CharField(choices=STAT_CHOICES, null=True, max_length=16)

    def save(self, *args, **kwargs):
        self.description = "Stuns if the target fails a DC {} {} save".format(
            self.save_dc, self.save_stat)
        self.effect_type = "Stun Effect"
        super().save(*args, **kwargs)

    def apply(self, creature):
        save_attempt = d20() + creature.saves[self.save_stat]
        if save_attempt >= self.save_dc:
            self.logger.log_action(
                "{0} saved from {1}".format(creature.name, self.name))
            return
        else:
            creature.applied_effects.append(self)

    def on_turn_start(self, creature):
        creature.num_actions_available = 0
        self.logger.log_action(
            "{0} was stunned by {1}".format(creature.name, self.name))
        self.turns_left -= 1

    def on_turn_end(self, creature):
        if self.turns_left <= 0:
            return False

        save_attempt = d20() + creature.saves[self.save_stat]
        if save_attempt >= self.save_dc:
            self.logger.log_action(
                "{0} saved from {1}".format(creature.name, self.name))
            return False
        else:
            self.logger.log_action(
                "{0} failed to save from {1}".format(creature.name, self.name))
            return True
