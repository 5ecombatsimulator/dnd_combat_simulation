import json

from settings import BASE_DIR

from actions.physical_attacks import PhysicalSingleAttack
from actions.heal import Heal
from actions.combo_attack import ComboAttack
from actions.spell_attacks import SpellSave, SpellSingleAttack

from data_managers.effect_manager import EffectManager

from utils.string import capitalize


ACTION_MAPPING = {"Combo Attack": ComboAttack,
                  "Heal": Heal,
                  "Spell Attack Requiring Save": SpellSave,
                  "Single Target Spell Attack": SpellSingleAttack,
                  "Single Target Physical Attack": PhysicalSingleAttack}


class ActionManager:
    def __init__(self):
        with open(BASE_DIR + '/data/actions.json', 'r') as f:
            self.action_info = json.load(f)
        self.effect_manager = EffectManager()

    def load_action(self, action_name):
        try:
            info = self.action_info[action_name]
        except KeyError:
            raise RuntimeError("Action with name {0} "
                               "could not be found.".format(action_name))

        build_action_info = {k: v for k, v in info.items()
                             if k not in ['effects', 'action_type']}

        if info['action_type'] == "Combo Attack":
            if info['action_type'] == "Combo Attack":
                build_action_info['attacks'] = [self.load_action(a['name'])
                                                for a in
                                                build_action_info['attacks']]
            return ACTION_MAPPING['Combo Attack'](**build_action_info)
        else:
            action_effects = []
            for effect_name in info['effects']:
                action_effects.append(
                    self.effect_manager.load_effect(effect_name))
            return ACTION_MAPPING[info['action_type']](effects=action_effects,
                                                       **build_action_info)

    def get_all_actions(self):
        """ Get a list of all actions with attributes for frontend

        Returns:
           JSON-dictionary of all actions with the following attributes:
            label: name of the actions
            expectedDamage: the damage expected from the action
        """
        return_info = []
        for a_info in self.action_info.values():
            return_info.append({
                "label": capitalize(a_info['name']),
                "value": a_info['name'],
                "actionType": a_info['action_type']
            })
        return return_info
