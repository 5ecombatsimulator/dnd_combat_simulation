from actions.models import *
from dice.models import Dice
from actions import damage_types


def goblin_attack():
    a = PhysicalSingleAttack(
        name='Short sword',
        stat_bones="STR",
        save_dc=None,
        save_stat=None,
        damage_type=damage_types.SLASHING
    )
    a.save()
    SingleAttackDice(
        dice=Dice.objects.get(num_sides=6),
        attack=a).save()
