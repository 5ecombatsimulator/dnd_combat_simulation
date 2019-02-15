from effects.effect import Effect


class StunEffect(Effect):
    def __init__(self, save, max_turns, name):
        """ Stun effect takes away the sufferer's actions for each turn its active

        :param save: A dictionary with 'stat' and 'DC' entries
        :param max_turns: Number of turns this stays active
        :param name: Name of this effect
        """
        super().__init__(max_turns, name)
        self.save = save
        self.effect_type = "Stun Effect"

    def apply(self, creature):
        save_attempt = d20() + creature.saves[self.save['stat']]
        if save_attempt >= self.save['DC']:
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

        save_attempt = d20() + creature.saves[self.save['stat']]
        if save_attempt >= self.save['DC']:
            self.logger.log_action(
                "{0} saved from {1}".format(creature.name, self.name))
            return False
        else:
            self.logger.log_action(
                "{0} failed to save from {1}".format(creature.name, self.name))
            return True

    def jsonify(self, effect_info=None, write_to_file=True):
        if not effect_info:
            effect_info = {
                'save': self.save
            }
        else:
            effect_info['save'] = self.save
        return super().jsonify(effect_info, write_to_file)
