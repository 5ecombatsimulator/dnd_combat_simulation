import json

from settings import BASE_DIR

from effects.dot_effect import DOTEffect
from effects.stun_effect import StunEffect

EFFECT_MAPPING = {
    "DOT Effect": DOTEffect,
    "Stun Effect": StunEffect
}


class EffectManager:
    def __init__(self):
        with open(BASE_DIR + '/data/effects.json', 'r') as f:
            self.effect_data = json.load(f)

    def load_effect(self, effect_name):
        try:
            info = self.effect_data[effect_name]
        except KeyError:
            raise RuntimeError("Effect with name {0} not found.".format(effect_name))

        build_effect_info = {k: v for k, v in info.items() if k != 'effect_type'}

        return EFFECT_MAPPING[info['effect_type']](**build_effect_info)
