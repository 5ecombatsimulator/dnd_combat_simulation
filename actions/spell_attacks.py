from math import ceil

from actions.attack import SingleAttack
from utils.dice import d20, calc_roll


class SpellSingleAttack(SingleAttack):
    def __init__(self, **kwargs):
        """ Either a saving throw from target or test of hit chance to targets AC
        Chance to hit is d20 + relevant stat bonus + bonus to damage
        A saving throw is a d20 + relevant stat bonus compared to spell DC
        """
        super().__init__(**kwargs)

    def do_damage(self, attacker, target):
        damage = 0
        if self.stat_bonus is not None:
            attack_bonus = attacker.proficiency + \
                           attacker.saves[self.stat_bonus] if self.stat_bonus != "None" else 0
            hit_check = d20() + attack_bonus + self.bonus_to_hit
            if hit_check >= attacker.ac:
                damage = calc_roll(self.dice) + self.bonus_to_damage
        else:
            save_check = d20() + target.saves[self.save['stat']]
            if save_check <= self.save['DC']:
                damage = calc_roll(self.dice) + self.bonus_to_damage

        target.take_damage(damage, self.damage_type)
        self.log_attack(attacker, target, damage)

    def jsonify(self):
        return super().jsonify("Single Target Spell Attack")


class SpellSave(SingleAttack):
    """ Spell saves are attacks which do full damage on a failed save or half
    as much on a successful save.

    :param name: Name of the attack
    :param stat_bonus: Must be None
    :param save: a dictionary with 'stat' and 'DC' as entries.
    :param damage: dictionary of damage dice for the attack
    :param recharge_percentile: percentile for recharge on the attack. The
                                    chance to recharge is
                                    p = (1 - recharge_percentile)
    :param num_available: number of times this is available per battle
    :param bonus_to_hit: Should be None
    :param bonus_to_damage: Should be None
    :param multi_attack: number of targets to hit for this attack.
                        (Expected number if aoe)
    :param effects: list of any Effect objects the attack inflicts
    """
    def __init__(self, **kwargs):
        assert kwargs.get('save') is not None
        super().__init__(**kwargs)

    def do_damage(self, attacker, target):
        save_check = d20() + target.saves[self.save['stat']]
        damage = calc_roll(self.dice)
        if save_check > self.save['DC']:
            damage = ceil(damage / 2.0)

        target.take_damage(damage, self.damage_type)

        self.log_attack(attacker, target, damage)

    def jsonify(self):
        return super().jsonify("Spell Attack Requiring Save")
