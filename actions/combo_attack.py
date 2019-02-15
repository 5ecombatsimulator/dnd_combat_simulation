from actions.attack import Attack, SingleAttack
from utils.file import write_json_to_file


class ComboAttack(Attack):
    def __init__(self, attacks, **kwargs):
        """ Container for multiple different attacks that do different damage

        This differs from a single attack multiattack, where each hit does the
        same damage dice, because this can incorporate multiple attacks of
        different types against a single enemy.

        An example of this is a Griffon which does two attacks every turn, one
        with it's beak and one with it's claws. Beak does 1d8+4 damage and claws
        do 2d6+4 damage.

        :param attacks: List of attack actions

        Notable keyword args:
        :param multi_attack: Does it perform the combo on multiple enemeies?
                            a value of 1 typically makes the most sense.

        """
        for a in attacks:
            assert isinstance(a, SingleAttack)
        self.attacks = attacks

        super().__init__(**kwargs)

    def calc_expected_damage(self):
        total_expected_damage = 0
        for attack in self.attacks:
            total_expected_damage += attack.calc_expected_damage()
        return total_expected_damage

    def do_damage(self, attacker, target):
        for attack in self.attacks:
            attack.do_damage(attacker, target)

    def apply_effects(self, target):
        for attack in self.attacks:
            attack.apply_effects(target)

    def jsonify(self, write_to_file=True):
        attack_info = {
            "name": self.name,
            "action_type": "Combo Attack",
            "attacks": [a.jsonify() for a in self.attacks]
        }
        if write_to_file:
            write_json_to_file('actions.json', attack_info)
        return attack_info
