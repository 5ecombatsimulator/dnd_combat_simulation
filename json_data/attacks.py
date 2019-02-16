from json_data.effects import mace_stun
from actions import damage_types

from actions_temp.physical_attacks import PhysicalSingleAttack
from actions_temp.spell_attacks import SpellSingleAttack
from actions_temp.combo_attack import ComboAttack


def short_sword_slash():
    return PhysicalSingleAttack(name="Short Sword",
                                stat_bonus="STR",
                                save=None,
                                dice={6: 1},
                                damage_type=damage_types.SLASHING)


def longsword_attack():
    return PhysicalSingleAttack(name="Long Sword",
                                stat_bonus="STR",
                                save=None,
                                dice={8: 1, 6: 2},
                                damage_type=damage_types.SLASHING)


def sneak_sword():
    return PhysicalSingleAttack(name="Sneak Sword",
                                stat_bonus="DEX",
                                save=None,
                                dice={8: 1, 6: 3},
                                damage_type=damage_types.SLASHING)


def power_throw():
    return PhysicalSingleAttack(name="Spin Throw",
                                stat_bonus="STR",
                                save=None,
                                dice={6: 3},
                                num_available=9,
                                damage_type=damage_types.PIERCING)


def apm():
    return PhysicalSingleAttack(name="Armor Piercing Missile",
                                stat_bonus="STR",
                                save=None,
                                dice={8: 5},
                                num_available=4,
                                damage_type=damage_types.PIERCING)


def throw_rock():
    return PhysicalSingleAttack(name="Throw Rock",
                                stat_bonus="STR",
                                save=None,
                                dice={4: 1},
                                damage_type=damage_types.BLUDGEONING)


def mace_hit():
    return PhysicalSingleAttack(name="Mace Hit",
                                stat_bonus="STR",
                                save=None,
                                dice={8: 1},
                                effects=[mace_stun()],
                                damage_type=damage_types.BLUDGEONING)


def scorching_ray():
    return SpellSingleAttack(name="Scorching Ray",
                             stat_bonus="INT",
                             save=None,
                             dice={6: 2},
                             num_available=2,
                             multi_attack=3,
                             damage_type=damage_types.FIRE)


def lightning_bolt():
    return SpellSingleAttack(name="Lightning Bolt",
                             save={"stat": "DEX", "DC": 15},
                             stat_bonus=None,
                             dice={6: 8},
                             num_available=3,
                             damage_type=damage_types.LIGHTNING)


def magic_missile():
    return SpellSingleAttack(name="Magic Missile",
                             stat_bonus="None",
                             save=None,
                             dice={4: 1},
                             num_available=4,
                             bonus_to_hit=1000,
                             bonus_to_damage=1,
                             multi_attack=3,
                             damage_type=damage_types.FORCE)


def acid_splash():
    return SpellSingleAttack(name="Acid Splash",
                             stat_bonus=None,
                             save={"stat": "DEX", "DC": 13},
                             dice={6: 1},
                             damage_type=damage_types.ACID)


def sacred_flame():
    return SpellSingleAttack(name="Sacred Flame",
                             stat_bonus=None,
                             save={"stat": "DEX", "DC": 13},
                             dice={8: 1},
                             damage_type=damage_types.RADIANT)


def guiding_bolt():
    return SpellSingleAttack(name="Guiding Bolt",
                             stat_bonus="WIS",
                             save=None,
                             dice={6: 4},
                             num_available=4,
                             damage_type=damage_types.RADIANT)


def beak():
    return PhysicalSingleAttack(name="Beak Strike",
                                stat_bonus="STR",
                                dice={8: 1},
                                damage_type=damage_types.PIERCING)


def claw():
    return PhysicalSingleAttack(name="Claw Strike",
                                stat_bonus="STR",
                                dice={6: 2},
                                damage_type=damage_types.SLASHING)


def griffon_combo():
    return ComboAttack(name="Griffon Combo", attacks=[beak(), claw()])
