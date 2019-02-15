from effects.effect import Effect


class PermanentTypeResistance(Effect):
    def __init__(self, max_turns, name):
        """ PermanentTypeResistance specifies that the thing with this effect is
             resistant to any damage from the named given type permanently

        :param max_turns: Number of turns this stays active
        :param name: Name of the element that this type is resistant to
        """
        super().__init__(max_turns, name)
        self.effect_type = "Type Resistance"

    def apply(self, creature):
        creature.applied_effects.append(self)

    def on_turn_start(self, creature):
        pass

    def on_turn_end(self, creature):
        return True

    def jsonify(self, effect_info=None, write_to_file=True):
        return super().jsonify(effect_info, write_to_file)
