from effects_temp.dot_effect import DOTEffect
from effects_temp.stun_effect import StunEffect


def bleed(dice, save, turns):
    return DOTEffect(dice=dice, save=save, max_turns=turns, name="bleed")


def mace_stun():
    return StunEffect(save={'stat': 'CON', 'DC': 14}, max_turns=3, name="mace_stun")