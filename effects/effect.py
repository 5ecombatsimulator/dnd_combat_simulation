from utils.file import write_json_to_file
from debug.logger import Logger


class Effect:
    logger = Logger()

    def __init__(self, max_turns, name):
        self.turns_left = max_turns
        self.name = name
        self.effect_type = "Base Effect"

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

    def jsonify(self, effect_info=None, write_to_file=True):
        if not effect_info:
            effect_info = {
                "name": self.name,
                "max_turns": self.turns_left,
                "effect_type": self.effect_type
            }
        else:
            effect_info['name'] = self.name
            effect_info['max_turns'] = self.turns_left
            effect_info['effect_type'] = self.effect_type

        if write_to_file:
            write_json_to_file('effects.json', effect_info)
        return effect_info
