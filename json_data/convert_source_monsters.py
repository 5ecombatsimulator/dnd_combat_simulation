import os.path as path
import math
import json
import re
import string
from collections import defaultdict

from django.db import IntegrityError

from actions.models import *
from actors.models import *

from simulation.settings import BASE_DIR
from utils.stats import convert_stat_to_bonus
from utils.data_parsing import find_recharge_percentile, \
    convert_challenge_rating, pull_out_damage_type

translate_table = str.maketrans({key: None for key in string.punctuation})

crs = list(range(1, 40)) + [0.125, 0.25, 0.5]
dice_map = dict(Dice.objects.values_list('num_sides', 'id'))

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
words_re = re.compile("|".join(count_mapping.keys()))


def determine_save(creature_entry, stat):
    save_string = stat + "_save"
    return creature_entry[save_string] if save_string in creature_entry else convert_stat_to_bonus(creature_entry[stat])


def create_attack(action_entry, creature_name, creature_cr, creature_saves,
                  is_legendary=False, cost=0, name_prefix=''):
    action_name = action_entry['name']
    attack_bonus = action_entry['attack_bonus']
    damage_bonus = action_entry['damage_bonus'] \
        if 'damage_bonus' in action_entry else 0
    dice_rolls = action_entry['damage_dice'].split("+")
    damage_dice = defaultdict(lambda: 0)
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
            name=name_prefix + creature_name + " - " + action_name,
            stat_bonus=stat_for_bonus,  # Little hacky...
            # Descriptions are: "... bludgeoning damage." Want 2nd to last word
            damage_type=pull_out_damage_type(action_entry['desc']),
            bonus_to_hit=0,
            is_legendary=is_legendary,
            legendary_action_cost=cost,
            recharge_percentile=find_recharge_percentile(action_name)
        )

    elif 'Spell Attack' in action_entry['desc']:
        which_stat = [x for x in creature_saves.items()
                      if x[1] == attack_bonus - proficiency_mapping[creature_cr]]
        stat_for_bonus = which_stat[0] if which_stat else "STR"

        created_action = SpellSingleAttack(
            name=name_prefix + creature_name + " - " + action_name,
            stat_bonus=stat_for_bonus,
            damage_type=pull_out_damage_type(action_entry['desc']),
            bonus_to_hit=0,
            is_legendary=is_legendary,
            legendary_action_cost=cost,
            recharge_percentile=find_recharge_percentile(action_name)
        )
    else:
        return None

    return created_action, damage_dice


def parse_multi_attack_clause(clause, creature_name, action_mapping, failed):
    attacks = []
    clause = clause.strip()
    try:
        space_split = clause.split(" ")
        action_name = (creature_name + " - " + space_split[-1]).lower()
        # Try the plural and non-plural version
        try:
            attack = action_mapping[action_name]
        except KeyError:
            attack = action_mapping[action_name[:-1]]
        count = count_mapping[words_re.search(clause)[0]]
        for _ in range(count):
            attacks.append(attack)
    except KeyError:
        try:
            space_split = clause.split(" ")
            action_name = (creature_name + " - " + space_split[-2]).lower()
            attack = action_mapping[action_name]
            count = count_mapping[words_re.search(clause)[0]]
            for _ in range(count):
                attacks.append(attack)
        except KeyError:
            failed = True
    except:
        failed = True
    return attacks, failed


def create_multiattack(creature_name, attack_description, other_actions):
    """ Creates a multi-attack action from other attacks

    Args:
        creature_name: the name of the creature that owns this multi-attack
        attack_description: the description field from the JSON object
        other_actions: a list of other actions_temp this creature can take

    Returns:
        a multi-attack action that uses the actions_temp defined in the description
    """

    action_name_mapping = {a[0].name.lower(): a[0] for a in other_actions}
    failed = False
    if ":" in attack_description:
        multi_desc = attack_description.split(":")[1].split(".")[0].strip()
        multi_desc = multi_desc.translate(translate_table)
        and_clauses = multi_desc.split("and")
        attacks = []
        for clause in and_clauses:
            clause_attacks, failed = parse_multi_attack_clause(
                clause, creature_name, action_name_mapping, failed)
            if failed:
                or_split = clause.split("or")
                clause_attacks, failed = parse_multi_attack_clause(
                    or_split[0], creature_name, action_name_mapping, failed)
            attacks.extend(clause_attacks)
    elif " or " in attack_description:
        multi_desc = attack_description.translate(translate_table)
        or_clauses = multi_desc.split("or")
        attacks, failed = parse_multi_attack_clause(
            or_clauses[0], creature_name, action_name_mapping, failed)
    else:
        attack_description = attack_description.translate(translate_table)
        attacks, failed = parse_multi_attack_clause(
            attack_description, creature_name, action_name_mapping, failed)
    if failed:
        print("Failed multi attack creation on:", attack_description)
        return None, None
    mattack = ComboAttack(
        name=creature_name + " - Multi-attack")

    return mattack, attacks


def parse_aoe_attack(action_entry):
    aoe_type_search_str = "(\d\d?)-foot (line|cone|radius|cube)"
    aoe_save_search_str = "DC (\d\d?) (Dexterity|Strength|Constitution|Wisdom|Intelligence|Charisma)"
    aoe_damage_search_str = ""
    # Check for multi-line entries.. default to first one
    description = action_entry['desc']
    if "\n" in action_entry['desc']:
        description = action_entry.split("\n")[1]


def parse_legendary_actions(combatant_entry):
    if 'legendary_actions' not in combatant_entry:
        return None

    regular_actions = {e['name'].lower(): e for e in
                       combatant_entry['actions']}

    def parse_single_legendary_action(legendary_action):
        name = legendary_action['name'].lower()
        desc = legendary_action['desc'].lower()

        possible_actions = []
        matched_cost = re.findall("Costs (\d{1}) Actions", name)
        cost = int(matched_cost[0]) if matched_cost else 1
        for action_name, action in regular_actions.items():
            if action_name in name or action_name in desc:
                possible_actions.append(action)
        return [(a, cost) for a in possible_actions]

    parsed_actions = []
    for laction in combatant_entry['legendary_actions']:
        parsed_actions.extend(parse_single_legendary_action(laction))
    return parsed_actions


def create_legendary_actions(found_legendary_actions, creature_name, cr, saves):
    """ Takes the found legendary actions and makes them into DB objects

    Args:
        found_legendary_actions (list (tuple (action dict, cost))):
            list returned from parse_legendary_actions
        creature_name (str): name of the creature
        cr (int): integer of the CR of the creature
        saves (dict): dictionary of save

    Returns:
        Action objects and CombatantAction parameters
    """
    legendary_creations = []
    for action_dict, cost in found_legendary_actions:
        try:
            action_obj, dice = create_attack(
                action_dict, creature_name, cr, saves,
                is_legendary=True, cost=cost, name_prefix='Legendary Action - ')
            legendary_creations.append((action_obj, dice, cost))
        except Exception as e:
            print("Errored with error {} on combatant: {}".format(
                e, creature_name))
    return legendary_creations


def create_dice_from_info(dice, action):
    created_dice = []
    for num_sides, num_dice in dice.items():
        created_dice.append(
            SingleAttackDice(attack=action,
                             num_dice=num_dice,
                             dice_id=dice_map[num_sides]))
    return created_dice


if not path.exists(BASE_DIR + "/json_data/source_monsters.json"):
    print("Please go to "
          "https://dl.dropboxusercontent.com/s/iwz112i0bxp2n4a/"
          "5e-SRD-Monsters.json and download the json file there and place "
          "it in the json_data directory to continue.")
    input("Press enter when moved...")

with open(BASE_DIR + "/json_data/source_monsters.json", 'r') as f:
    source = json.load(f)


def construct_creature(combatant_entry):
    # ---  Base attributes ---
    name = combatant_entry['name']
    hp = int(combatant_entry['hit_points'])
    ac = int(combatant_entry['armor_class'])
    cr = convert_challenge_rating(combatant_entry['challenge_rating'])
    proficiency = proficiency_mapping[cr]

    # --- Saves ---
    saves = {
        "STR": determine_save(combatant_entry, "strength"),
        "DEX": determine_save(combatant_entry, "dexterity"),
        "CON": determine_save(combatant_entry, "constitution"),
        "WIS": determine_save(combatant_entry, "wisdom"),
        "INT": determine_save(combatant_entry, "intelligence"),
        "CHA": determine_save(combatant_entry, "charisma")
    }

    # --- Actions ---
    combatant_actions = []
    multi_attack_description = None
    if 'actions' not in combatant_entry:
        print("Error on creature with name: {}".format(name))
        return None
    for action in combatant_entry['actions']:
        if action['name'] == "Multiattack":
            multi_attack_description = action['desc']
        elif action['attack_bonus'] == 0:
            # Action is just some special effect.. figure out how to deal later
            pass
        else:
            try:
                action_object, damage_dice = create_attack(action, name, cr, saves)
                if action:
                    combatant_actions.append((action_object, damage_dice, None))
            except KeyError:
                break

    if multi_attack_description:
        multi_attack, component_attacks = create_multiattack(
            name, multi_attack_description, combatant_actions)
        if multi_attack:
            combatant_actions.append((multi_attack, None, component_attacks))

    legendary_action_info = []
    if 'legendary_actions' in combatant_entry:
        parsed_actions = parse_legendary_actions(combatant_entry)
        legendary_action_info = create_legendary_actions(
            parsed_actions, name, cr, saves)

    # If there are no actions_temp, we don't know how to process any of the
    # combatant's actions_temp yet so skip that combatant for now
    if not combatant_actions:
        return None

    combatant = Combatant(
        name=name,
        max_hp=hp,
        ac=ac,
        proficiency=proficiency,
        str_save=saves["STR"],
        dex_save=saves["DEX"],
        con_save=saves["CON"],
        wis_save=saves["WIS"],
        int_save=saves["INT"],
        cha_save=saves["CHA"],
        cr=cr,
        num_legendary_actions=3 if 'legendary_actions' in combatant_entry else 0
    )
    with transaction.atomic():
        try:
            combatant.save()
        except IntegrityError:
            print("Integrity error on:", combatant.name)
            return
        cas = []
        single_attack_dice = []
        mattack_components = []
        for action, dice, multi_attack_components in combatant_actions:
            try:
                action.save()
            except IntegrityError:
                print(action.name)
                continue
            except transaction.TransactionManagementError:
                print("TM Error on:", action.name)
                return
            if dice:
                single_attack_dice.extend(create_dice_from_info(dice, action))
            if multi_attack_components:
                for a in multi_attack_components:
                    mattack_components.append(ComboAttackComponents(
                        combo_attack=action,
                        single_attack=a
                    ))
            cas.append(CombatantAction(action=action, combatant=combatant))
        for action, dice, cost in legendary_action_info:
            action.save()
            single_attack_dice.extend(create_dice_from_info(dice, action))
            cas.append(CombatantAction(action=action, combatant=combatant))
        SingleAttackDice.objects.bulk_create(single_attack_dice)
        CombatantAction.objects.bulk_create(cas)
        ComboAttackComponents.objects.bulk_create(mattack_components)


def run_conversion():
    for entry in source:
        if 'name' not in entry:
            print(entry)
            continue

        construct_creature(entry)

