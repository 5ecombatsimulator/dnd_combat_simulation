from django.db import models

from dice.models import Dice
from actions.stat_choices import STAT_CHOICES

from utils.dice import calc_roll, d20
from debug.logger import Logger


# Effect type constants
STUN_EFFECT_TYPE = "Stun Effect"
PARALYZE_EFFECT_TYPE = "Paralyze Effect"
DOT_EFFECT_TYPE = "DOT Effect"
BLINDED_EFFECT_TYPE = "Blinded Effect"
RESTRAINED_EFFECT_TYPE = "Restrained Effect"
INVISIBLE_EFFECT_TYPE = "Invisible Effect"
PETRIFIED_EFFECT_TYPE = "Petrified Effect"
POISONED_EFFECT_TYPE = "Poisoned Effect"
PRONE_EFFECT_TYPE = "Prone Effect"

TYPE_RESISTANCE_TYPE = "Type Resistance"
TYPE_IMMUNITY_TYPE = "Type Immunity"
TYPE_VULNERABILITY_TYPE = "Type Vulnerability"


def get_effect_list():
    return [
        STUN_EFFECT_TYPE, PARALYZE_EFFECT_TYPE, DOT_EFFECT_TYPE,
        BLINDED_EFFECT_TYPE, RESTRAINED_EFFECT_TYPE, INVISIBLE_EFFECT_TYPE,
        PETRIFIED_EFFECT_TYPE, POISONED_EFFECT_TYPE, PRONE_EFFECT_TYPE
    ]


# Effects that apply advantage for an attacker if the target has them
TARGET_ADVANTAGE_SET = {
    PRONE_EFFECT_TYPE, RESTRAINED_EFFECT_TYPE, BLINDED_EFFECT_TYPE,
    STUN_EFFECT_TYPE, PARALYZE_EFFECT_TYPE
}

# Effects that apply disadvantage for an attacker if the target has them
TARGET_DISADVANTAGE_SET = {
    INVISIBLE_EFFECT_TYPE
}

# Effects that apply disadvantage when the attacker has them
SELF_DISADVANTAGE_SET = {
    PRONE_EFFECT_TYPE, POISONED_EFFECT_TYPE, BLINDED_EFFECT_TYPE,
    RESTRAINED_EFFECT_TYPE,
}

# Effects that give an attacker advantage if they have them
SELF_ADVANTAGE_SET = {
    INVISIBLE_EFFECT_TYPE
}


class Effect(models.Model):
    name = models.CharField(max_length=128, unique=True)
    effect_type = models.CharField(max_length=32)
    description = models.TextField(null=True)
    max_turns = models.SmallIntegerField(default=-1)

    def instantiate(self, turns_left=None):
        self.logger = Logger()
        self.turns_left = turns_left or self.max_turns

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

    @classmethod
    def create_named_effect(cls, name, max_turns, save_stat, save_dc):
        if name == "":
            return None, "Name must be non-empty"
        elif max_turns <= 0:
            return None, "Effect must last for at least 1 turn"

        created = cls.objects.create(name=name, max_turns=max_turns,
                           save_stat=save_stat, save_dc=save_dc)
        if created:
            return created, "Success"
        else:
            return None, "Failed to create effect, unknown error"


    @staticmethod
    def create_effect(*args, **kwargs):
        effect_type = kwargs['effect_type']
        if effect_type == STUN_EFFECT_TYPE:
            return StunEffect.create_named_effect(
                kwargs['name'], kwargs['max_turns'],
                kwargs['save_stat'], kwargs['save_dc'])
        elif effect_type == PARALYZE_EFFECT_TYPE:
            return ParalyzedEffect.create_named_effect(
                kwargs['name'], kwargs['max_turns'],
                kwargs['save_stat'], kwargs['save_dc'])
        else:
            return None, f"Unaccounted for effect type: {effect_type}"

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


class DamageTypeInteractionEffect(Effect):
    def apply(self, creature):
        creature.applied_effects.append(self)

    def on_turn_start(self, creature):
        return True

    def on_turn_end(self, creature):
        return True


class DamageTypeResistance(DamageTypeInteractionEffect):

    def save(self, *args, **kwargs):
        self.effect_type = TYPE_RESISTANCE_TYPE
        super().save(*args, **kwargs)


class DamageTypeImmunity(DamageTypeInteractionEffect):

    def save(self, *args, **kwargs):
        self.effect_type = TYPE_IMMUNITY_TYPE
        super().save(*args, **kwargs)


class DamageTypeVulnerability(DamageTypeInteractionEffect):

    def save(self, *args, **kwargs):
        self.effect_type = TYPE_VULNERABILITY_TYPE
        super().save(*args, **kwargs)


class EffectWithSave(Effect):
    save_dc = models.SmallIntegerField()
    save_stat = models.CharField(choices=STAT_CHOICES, null=True, max_length=16)

    def apply(self, creature):
        save_attempt = d20() + creature.saves[self.save_stat]
        if save_attempt >= self.save_dc:
            self.logger.log_action(
                "{0} saved from {1}".format(creature.name, self.name))
            return
        else:
            creature.applied_effects.append(self)


class DOTEffect(EffectWithSave):
    dice = models.ManyToManyField(Dice, through='DOTDice')

    def save(self, *args, **kwargs):
        self.description = "{} damage per turn with a DC {} {} save".format(
            self.format_dice(), self.save_dc, self.save_stat)
        self.effect_type = DOT_EFFECT_TYPE
        super().save(*args, **kwargs)

    def format_dice(self):
        dice = DOTDice.objects.filter(effect=self)
        return "+".join(["{}d{}".format(nsides, num_dice)
                         for nsides, num_dice in dice.values_list(
                'dice__num_sides', 'num_dice')])

    def on_turn_start(self, creature):
        total = calc_roll(self.dice)
        self.logger.log_action("{0} suffered {1} for {2} damage".format(creature.name, self.name, total))
        creature.hp -= total
        self.turns_left -= 1
        return True

    def on_turn_end(self, creature):
        save_attempt = d20() + creature.saves[self.save_stat]
        if save_attempt >= self.save_dc:
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


class StunEffect(EffectWithSave):

    def save(self, *args, **kwargs):
        self.description = "Stuns if the target fails a DC {} {} save".format(
            self.save_dc, self.save_stat)
        self.effect_type = STUN_EFFECT_TYPE
        super().save(*args, **kwargs)

    def on_turn_start(self, creature):
        creature.num_actions_available = 0
        self.logger.log_action(
            "{0} was stunned by {1}".format(creature.name, self.name))
        self.turns_left -= 1
        return True

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


class ParalyzedEffect(StunEffect):

    def save(self, *args, **kwargs):
        self.description = "Paralyzes if the target fails a DC {} {} save".format(
            self.save_dc, self.save_stat)
        self.effect_type = PARALYZE_EFFECT_TYPE
        super().save(*args, **kwargs)


class ProneEffect(EffectWithSave):

    def save(self, *args, **kwargs):
        self.description = "Prone if the target fails a DC {} {} save".format(
            self.save_dc, self.save_stat)
        self.effect_type = PRONE_EFFECT_TYPE
        super().save(*args, **kwargs)

    def on_turn_start(self, creature):
        # Creatures always stand up right away
        return False

    def on_turn_end(self, creature):
        return False


class PoisonedEffect(EffectWithSave):
    def save(self, *args, **kwargs):
        self.description = "Poisoned if the target fails a DC {} {} save".format(
            self.save_dc, self.save_stat)
        self.effect_type = POISONED_EFFECT_TYPE
        super().save(*args, **kwargs)

    def on_turn_start(self, creature):
        self.turns_left -= 1
        return True

    def on_turn_end(self, creature):
        # Poison lasts for X number of turns.. no save
        if self.turns_left <= 0:
            return False
        return True


class BlindedEffect(EffectWithSave):
    def save(self, *args, **kwargs):
        self.description = "Blinded if the target fails a DC {} {} save".format(
            self.save_dc, self.save_stat)
        self.effect_type = BLINDED_EFFECT_TYPE
        super().save(*args, **kwargs)

    def on_turn_start(self, creature):
        self.turns_left -= 1
        return True

    def on_turn_end(self, creature):
        if self.turns_left <= 0:
            return False


class RestrainedEffect(EffectWithSave):
    def save(self, *args, **kwargs):
        self.description = "Restrained if the target fails a DC {} {} save".format(
            self.save_dc, self.save_stat)
        self.effect_type = RESTRAINED_EFFECT_TYPE
        super().save(*args, **kwargs)

    def on_turn_start(self, creature):
        return True

    def on_turn_end(self, creature):
        return True

    def attempt_to_break_free(self, creature):
        save_attempt = d20() + creature.saves[self.save_stat]
        if save_attempt >= self.save_dc:
            self.logger.log_action(
                "{0} broke free from {1}".format(creature.name, self.name))
            return False
        return True


class InvisibleEffect(Effect):
    def save(self, *args, **kwargs):
        self.description = "Makes target invisible"
        self.effect_type = INVISIBLE_EFFECT_TYPE
        super().save(*args, **kwargs)

    def on_turn_start(self, creature):
        self.turns_left -= 1
        return True

    def on_turn_end(self, creature):
        if self.turns_left <= 0:
            return False
        if creature.num_actions_available == 0:
            return False


class PetrifiedEffect(EffectWithSave):

    def save(self, *args, **kwargs):
        self.description = "Petrified if the target fails a DC {} {} save".format(
            self.save_dc, self.save_stat)
        self.effect_type = PETRIFIED_EFFECT_TYPE
        super().save(*args, **kwargs)

    def on_turn_start(self, creature):
        save_attempt = d20() + creature.saves[self.save_stat]
        if save_attempt >= self.save_dc:
            self.logger.log_action(
                "{0} saved from {1}".format(creature.name, self.name))
            return False
        return True

    def on_turn_end(self, creature):
        # TODO: Do something here if they fail 3 times in a row
        if self.turns_left == 0:
            return False

        return True
