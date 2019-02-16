import os.path as path
import math
import json

from settings import BASE_DIR
from utils.stats import convert_stat_to_bonus

from actions_temp.physical_attacks import PhysicalSingleAttack
from actions_temp.spell_attacks import SpellSingleAttack
from actions_temp.combo_attack import ComboAttack

from data_managers.action_manager import ActionManager
from actors.combatant import Combatant

crs = list(range(1, 40)) + [0.125, 0.25, 0.5]

proficiency_mapping = {x: max(math.floor((x-0.01)/4)+2, 2) for x in crs}
# This entry doesn't fit the formula...
proficiency_mapping[0] = 2

count_mapping = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8
}


def convert_challenge_rating(cr_string):
    if "/" in cr_string:
        numerator, denominator = tuple(cr_string.split("/"))
        return float(int(numerator)/int(denominator))
    else:
        return int(cr_string)


def pull_out_damage_type(description):
    """ Get the type of damage from an attack description

    Descriptions can have extra text after the damage type, but the
    beginning will always have the same format.

    Standard format: "Melee Weapon Attack: +9 to hit, reach 10 ft. one target. Hit: 15 (3d6 + 5) bludgeoning damage."

    Problematic attack: "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage.
    If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased.
    The disease has no effect for 1 minute and can be removed by any magic that cures disease.
    After 1 minute, the diseased creature's skin becomes translucent and slimy,
    the creature can't regain hit points unless it is underwater, and the
    disease can be removed only by heal or another disease-curing spell of 6th
    level or higher. When the creature is outside a body of water, it takes
    6 (1d12) acid damage every 10 minutes unless moisture is applied to the
    skin before 10 minutes have passed."

    Args:
        description: a description in the action

    Returns:
        a single string for the type of the attack
    """
    description_split = description.split(".")
    damage_type_split = description_split[2]
    return damage_type_split.split(" ")[-2]


def determine_save(creature_entry, stat):
    save_string = stat + "_save"
    return creature_entry[save_string] if save_string in creature_entry else convert_stat_to_bonus(creature_entry[stat])


def create_attack(action_entry, creature_name, creature_cr, creature_saves):
    action_name = action_entry['name']
    attack_bonus = action_entry['attack_bonus']
    damage_bonus = action_entry['damage_bonus'] \
        if 'damage_bonus' in action_entry else 0
    dice_rolls = action_entry['damage_dice'].split("+")
    damage_dice = {}
    for dice in dice_rolls:
        dice = dice.strip()
        num_dice, which_dice = tuple(dice.split("d"))
        damage_dice[int(which_dice)] = int(num_dice)
    if 'Weapon Attack' in action_entry['desc']:
        # The json source file has attack bonus per attack, but we want to
        # change it to vary based on the stat. The attack bonus is actually
        # based on a stat held by the monster plus some proficiency, but this
        # can be separated via the damage bonus, which is only based on the stat
        which_stat = [x for x in creature_saves.items() if x[1] == damage_bonus]
        stat_for_bonus = which_stat[0][0] if which_stat else "STR"
        created_action = PhysicalSingleAttack(
            name=creature_name + " - " + action_name,
            stat_bonus=stat_for_bonus,  # Little hacky...
            # Descriptions are: "... bludgeoning damage." Want 2nd to last word
            damage_type=pull_out_damage_type(action_entry['desc']),
            bonus_to_hit=0,
            dice=damage_dice
        )
    elif 'Spell Attack' in action_entry['desc']:
        which_stat = [x for x in creature_saves.items()
                      if x[1] == attack_bonus - proficiency_mapping[creature_cr]]
        stat_for_bonus = which_stat[0] if which_stat else "STR"

        created_action = SpellSingleAttack(
            name=creature_name + " - " + action_name,
            stat_bonus=stat_for_bonus,
            damage_type=pull_out_damage_type(action_entry['desc']),
            bonus_to_hit=0,
            dice=damage_dice
        )
    else:
        return None
    return created_action


def create_multiattack(creature_name, attack_description, other_actions):
    """ Creates a multi-attack action from other attacks

    Args:
        creature_name: the name of the creature that owns this multi-attack
        attack_description: the description field from the JSON object
        other_actions: a list of other actions_temp this creature can take

    Returns:
        a multi-attack action that uses the actions_temp defined in the description
    """
    action_name_mapping = {a.name.lower(): a for a in other_actions}
    if ":" in attack_description:
        multi_desc = attack_description.split(":")[1].split(".")[0].strip()
        and_clauses = multi_desc.split("and")
        attacks = []
        for clause in and_clauses:
            clause = clause.strip()
            try:
                space_split = clause.split(" ")
                action_map = creature_name + " - " + space_split[-1][:-1]
                attack = action_name_mapping[action_map.lower()]
                count = count_mapping[space_split[0]]
                for _ in range(count):
                    attacks.append(attack)
            except:
                return None
    else:
        attacks = []
        try:
            space_split = attack_description.split(" ")
            action_map = creature_name + " - " + space_split[-2]
            attack = action_name_mapping[action_map.lower()]
            count = count_mapping[space_split[-3]]
            for _ in range(count):
                attacks.append(attack)
        except:
            return None
    mattack = ComboAttack(
        name=creature_name + " - Multi-attack",
        attacks=attacks)
    mattack.jsonify()
    return mattack


if not path.exists(BASE_DIR + "/json_data/source_monsters.json"):
    print("Please go to "
          "https://dl.dropboxusercontent.com/s/iwz112i0bxp2n4a/"
          "5e-SRD-Monsters.json and download the json file there and place "
          "it in the json_data directory to continue.")

with open(BASE_DIR + "/json_data/source_monsters.json", 'r') as f:
    source = json.load(f)

for entry in source:
    if 'name' not in entry:
        print(entry)
        continue

    # ---  Base attributes ---
    name = entry['name']
    hp = int(entry['hit_points'])
    ac = int(entry['armor_class'])
    cr = convert_challenge_rating(entry['challenge_rating'])
    proficiency = proficiency_mapping[cr]

    # --- Saves ---
    saves = {
        "STR": determine_save(entry, "strength"),
        "DEX": determine_save(entry, "dexterity"),
        "CON": determine_save(entry, "constitution"),
        "WIS": determine_save(entry, "wisdom"),
        "INT": determine_save(entry, "intelligence"),
        "CHA": determine_save(entry, "charisma")
    }

    # --- Actions ---
    am = ActionManager()
    combatant_actions = []
    consumed_actions = []  # a list of json objects that turned into actions_temp
    multi_attack_description = None
    if 'actions_temp' not in entry:
        print(name)
        continue
    for action in entry['actions_temp']:
        if action['name'] == "Multiattack":
            multi_attack_description = action['desc']
        elif action['attack_bonus'] == 0:
            # Action is just some special effect.. figure out how to deal later
            pass
        else:
            try:
                action_object = create_attack(action, name, cr, saves)
                if action:
                    action_object.jsonify()
                    combatant_actions.append(action_object)
                    consumed_actions.append(action)
            except KeyError:
                break

    if multi_attack_description:
        multi_attack = create_multiattack(name,
                                          multi_attack_description,
                                          combatant_actions)
        if multi_attack:
            combatant_actions.append(multi_attack)

    # If there are no actions_temp, we don't know how to process any of the
    # combatant's actions_temp yet so skip that combatant for now
    if not combatant_actions:
        continue

    combatant = Combatant(
        name=name,
        hp=hp,
        ac=ac,
        proficiency=proficiency,
        saves=saves,
        actions=combatant_actions,
        cr=cr
    )
    combatant.jsonify(write_to_file=True)






