import re
from actions.damage_types import DAMAGE_TYPE_CHOICES


damage_type_search = re.compile("|".join([x[0] for x in DAMAGE_TYPE_CHOICES]))


def find_recharge_percentile(attack_name):
    """ Finds the appropriate recharge percentile from an attack name

    Notes:
        This should be filling in recharge_percentile. That number determines if
        the attack recharges if a random [0,1] float is >= recharge_percentile.
        Thus, recharge 4-6 should put in 0.5 to recharge percentile and recharge
        6 should put in float(5/6).

    Args:
        attack_name (str): Name of the attack to find the recharge for

    Returns:

    """
    found_recharge = re.findall("Recharge (\d{1})", attack_name)
    if found_recharge:
        return (int(found_recharge[0]) - 1) / 6
    else:
        return 0.0


def convert_challenge_rating(cr_string):
    if "/" in cr_string:
        numerator, denominator = tuple(cr_string.split("/"))
        return float(int(numerator)/int(denominator))
    else:
        return int(cr_string)


def pull_out_damage_type(description):
    """ Get the type of damage from an attack description

    Descriptions can have extra text after the damage type, but the
    beginning will always have the same format.

    Standard format: "Melee Weapon Attack: +9 to hit, reach 10 ft. one target. Hit: 15 (3d6 + 5) bludgeoning damage."

    Problematic attack: "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage.
    If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased.
    The disease has no effect for 1 minute and can be removed by any magic that cures disease.
    After 1 minute, the diseased creature's skin becomes translucent and slimy,
    the creature can't regain hit points unless it is underwater, and the
    disease can be removed only by heal or another disease-curing spell of 6th
    level or higher. When the creature is outside a body of water, it takes
    6 (1d12) acid damage every 10 minutes unless moisture is applied to the
    skin before 10 minutes have passed."

    Args:
        description: a description in the action

    Returns:
        a single string for the type of the attack
    """
    description_split = description.split(".")
    damage_type_split = description_split[2]
    return damage_type_split.split(" ")[-2]
