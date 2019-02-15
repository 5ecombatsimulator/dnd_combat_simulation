from actions.action import Action
from utils.file import write_json_to_file
from utils.dice import load_dice


class Attack(Action):
    def __init__(self, name, recharge_percentile=0.0, num_available=-1,
                 multi_attack=1):
        self.name = name
        self.recharge_percentile = recharge_percentile
        self.num_available = num_available
        self.action_type = "Attack"
        self.multi_attack = multi_attack
        self.aoe = False
        # If the attack is ready at the current time. All attacks start ready
        self.ready = True


class SingleAttack(Attack):
    def __init__(self, dice, damage_type, bonus_to_hit=0, bonus_to_damage=0,
                 stat_bonus=None, save=None, aoe=False, effects=None, **kwargs):
        """
        :param name: Name of the attack
        :param stat_bonus: bonus to hit for the attack. One of this or
                            save must be None
        :param save: a dictionary with 'stat' and 'DC' as entries. One of this
                        or stat_bonus must be None
        :param dice: dictionary of damage dice for the attack
        :param recharge_percentile: percentile for recharge on the attack. The
                                        chance to recharge is
                                        p = (1 - recharge_percentile)
        :param num_available: number of times this is available per battle
        :param bonus_to_hit: integer for bonus to hit for the attack
        :param bonus_to_damage: integer for bonus to damage on the attack
        :param multi_attack: number of targets to hit for this attack
        :param aoe: If this is an aoe attack or not. If it is, the multi-attack
                    should be >1 and the attack will not hit the same target twice
        :param effects: list of any Effect objects the attack inflicts
        """
        assert stat_bonus is None or save is None
        assert stat_bonus is not None or save is not None
        self.stat_bonus = stat_bonus
        self.damage_type = damage_type
        self.save = save
        self.dice = load_dice(dice)
        self.bonus_to_hit = bonus_to_hit
        self.bonus_to_damage = bonus_to_damage
        self.aoe = aoe
        self.effects = effects if effects else []

        super().__init__(**kwargs)

    def do_damage(self, attacker, target):
        """ Called to test whether an attack hits and then applies the damage.
        :param attacker: The creature using the attack
        :param target: The creature receiving the attack
        :return: None, damage is applied on the target object
        """
        raise NotImplementedError("do_damage is not implemented on this class!")

    def calc_expected_damage(self):
        return self.multi_attack * sum([n_dice * (max_roll / 2.0 + 0.5) for
                                        n_dice, max_roll in self.dice.items()])

    def apply_effects(self, target):
        [effect.apply(target) for effect in self.effects]

    def log_attack(self, attacker, target, damage):
        self.logger.log_action("{0} took {1} damage from {2} ({3})".format(
            target.name, damage, self.name, attacker.name))

    def jsonify(self, attack_type="Single Target Attack", write_to_file=True):
        attack_info = {
            "name": self.name,
            "action_type": attack_type,
            "damage_type": self.damage_type,
            "stat_bonus": self.stat_bonus,
            "save": self.save,
            "dice": self.dice,
            "bonus_to_hit": self.bonus_to_hit,
            "bonus_to_damage": self.bonus_to_damage,
            "aoe": self.aoe,
            "multi_attack": self.multi_attack,
            "recharge_percentile": self.recharge_percentile,
            "effects": [e.name for e in self.effects]
        }
        if write_to_file:
            write_json_to_file("actions.json", attack_info)
        return attack_info
