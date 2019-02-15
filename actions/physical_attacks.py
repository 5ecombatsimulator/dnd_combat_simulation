from actions.attack import SingleAttack
from utils.dice import calc_roll, d20


class PhysicalSingleAttack(SingleAttack):
    def __init__(self, **kwargs):
        """ An attack that tests the chance to hit against target's AC
        Chance to hit = roll d20 + attackers save + attack bonus to hit
        """
        super().__init__(**kwargs)

    def do_damage(self, attacker, target):
        damage = 0
        hit_check = d20() + attacker.saves[self.stat_bonus] + self.bonus_to_hit + attacker.proficiency
        if hit_check >= target.ac:
            damage = calc_roll(self.dice) + attacker.saves[self.stat_bonus] + self.bonus_to_damage

        target.take_damage(damage, self.damage_type)
        self.log_attack(attacker, target, damage)

    def jsonify(self):
        return super().jsonify("Single Target Physical Attack")
