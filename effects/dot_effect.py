from effects.effect import Effect
from utils.dice import load_dice, d20, calc_roll


class DOTEffect(Effect):
    def __init__(self, dice, save, max_turns, name):
        """ DOT effect applies damage each turn the effect is active

        :param dice: A dictionary of (faces, amount) pairs
        :param save: A dictionary with 'stat' and 'DC' entries
        :param max_turns: Number of turns this stays active
        :param name: Name of the effect
        """

        super().__init__(max_turns, name)
        self.save = save
        self.dice = load_dice(dice)
        self.effect_type = "DOT Effect"

    def apply(self, creature):
        save_attempt = d20() + creature.saves[self.save['stat']]
        if save_attempt >= self.save['DC']:
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

    def jsonify(self, effect_info=None, write_to_file=True):
        if not effect_info:
            effect_info = {
                'dice': self.dice,
                'save': self.save
            }
        else:
            effect_info['dice'] = self.dice
            effect_info['save'] = self.save
        return super().jsonify(effect_info, write_to_file)
