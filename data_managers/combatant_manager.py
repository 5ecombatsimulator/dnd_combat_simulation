from copy import deepcopy

from actors.models import Combatant
from utils.string import capitalize
from simulation.heuristics.heuristic_container import HeuristicContainer


class CombatantManager:
    def __init__(self, heuristics=HeuristicContainer()):
        self.heuristics = heuristics

    def load_combatants(self):
        # with open(BASE_DIR + '/json_data/combatants.json', 'r') as f:
        #     self.combatant_info = json.load(f)
        return Combatant.objects.all()

    def create_combatant(self, combatant_name, hp, ac,
                         proficiency_bonus, saves, actions):
        """ Creates a combatant with the given attributes

        Args:
            combatant_name: string specifying the name
            hp: the hp of the combatant
            ac: the ac of the combatant
            proficiency_bonus: the proficiency bonus of the combatant
            saves: a dictionary with an entry for "STR", "CON", "DEX", "WIS",
                "INT", "CHA". Each value should be an integer.
            actions: a list of action names that the combatant should be able
                to take.

        Returns:
            succeeded: bool for if the creation succeeded
            msg: error message or "Success!" if the call succeeded=
        """

        try:
            hp = int(hp)
        except ValueError:
            return False, "Given HP was not valid"

        try:
            ac = int(ac)
        except ValueError:
            return False, "Given AC was not valid"

        try:
            proficiency_bonus = int(proficiency_bonus)
        except ValueError:
            return False, "Given proficiency bonus was not valid"

        try:
            saves = {k: int(v) for k,v in saves.items()}
        except ValueError:
            return False, "A save value is not valid"

        built_actions = []
        for a in actions:
            try:
                built_actions.append(self.action_manager.load_action(a))
            except RuntimeError:
                return False, "{} is not a valid action name".format(a)
        combatant = Combatant(combatant_name, hp, ac, proficiency_bonus,
                              saves, built_actions)
        combatant.jsonify(write_to_file=True)
        return True, "Success!"

    def load_combatant(self, combatant_name, name_suffix=""):
        """ Loads a previously saved combatant given a name """

        try:
            combatant = Combatant.objects.get(name=combatant_name)
        except Combatant.DoesNotExist:
            raise RuntimeError('Creature with name {0} could not '
                               'be found.'.format(combatant_name))

        combatant.ready_for_battle(heuristics=self.heuristics)
        if name_suffix:
            combatant.name += "_" + name_suffix

        return combatant

    def get_all_combatants(self, reload=False):
        """ Gets a list of all of the combatants in a JSON dictionary

        Used to populate the combatants on the front-end

        """
        # TODO: Update this method

        return_info = []
        for c_info in self.combatant_info.values():
            return_info.append({
                "label": capitalize(c_info['name']),
                "value": c_info['name'],
                "cr": c_info['cr'] if 'cr' in c_info else None,
                "expDamage": 10,
                "creatureType": c_info['creature_type'] if "creature_type" in c_info else None
            })

        return return_info
