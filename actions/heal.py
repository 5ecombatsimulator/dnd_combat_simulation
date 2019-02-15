from actions.action import Action
from utils.dice import load_dice
from utils.file import write_json_to_file


class Heal(Action):
    def __init__(self, name, dice, stat_bonus, recharge_percentile=0.0,
                 num_available=-1, num_targets=1, effects=None):
        """ A heal restores hit points to an ally. Always hits

        :param name: string that is name of the heal
        :param heal: dictionary with keys as dice value and values as number of that dice
        :param stat_bonus: string with the bonus based of which stat the caster uses
        :param recharge_percentile: chance to recharge is p = 1 - recharge percentile
        :param num_available: number of this heal available during a battle.
                            a value of -1 means it's always available.
        """
        self.name = name
        self.dice = load_dice(dice)
        self.stat_bonus = stat_bonus
        self.recharge_percentile = recharge_percentile
        self.num_available = num_available
        self.ready = True  # If the attack is ready at the current time. All attacks start ready
        self.action_type = "Heal"
        self.num_targets = num_targets
        self.effects = effects if effects else []

    def log_heal(self, healed, new_health, healer):
        self.logger.log_action("{0} healed from {1} to {2} ({3})".format(healed.name, healed.hp, new_health, healer.name))

    def do_heal(self, healer, healed):
        health_up = calc_roll(self.dice) + (healer.saves[self.stat_bonus] if
                                       self.stat_bonus != "None" else 0)
        new_health = min(healed.hp + health_up, healed.max_hp)
        self.log_heal(healed, new_health, healer)
        healed.hp = new_health

    def jsonify(self, write_to_file=True):
        heal_info = {
            "action_type": "Heal",
            "name": self.name,
            "dice": self.dice,
            "stat_bonus": self.stat_bonus,
            "recharge_percentile": self.recharge_percentile,
            "num_targets": self.num_targets,
            "effects": [e.name for e in self.effects]
        }
        if write_to_file:
            write_json_to_file("actions.json", heal_info)
        return heal_info