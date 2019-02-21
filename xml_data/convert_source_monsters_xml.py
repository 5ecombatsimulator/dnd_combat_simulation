import math
import re
import string
import xml.etree.ElementTree as ET

from django.db import IntegrityError

from actions.models import *
from actors.models import *

from utils.stats import convert_stat_to_bonus
from utils.data_parsing import find_recharge_percentile, \
    convert_challenge_rating

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


def parse_save(save_element):
    return convert_stat_to_bonus(int(save_element.text))


def parse_type(type_element):
    return type_element.text.split(" ")[0].translate(translate_table)


def parse_speed(speed_element):
    speed = re.findall("(\d+)", speed_element.text)
    if speed:
        return int(speed[0])
    return 30


damage_parse = "(\d\d?d\d\d?)"
bonus_damage_parse = "\+(\d\d?)[^d]?"
damage_type_parse = re.compile("|".join([x[0] for x in DAMAGE_TYPE_CHOICES]))
attack_type_parse = ".*(Weapon|Spell) Attack"
def parse_attack(attack_element, saves):
    name = attack_element.find('name').text
    desc = attack_element.find('text').text
    attack_text = attack_element.find("attack").text
    damage_str = attack_text.split("|")[2]
    dice_damage = re.findall(damage_parse, damage_str)
    bonus_damage = re.findall(bonus_damage_parse, damage_str)
    damage_types = re.findall(damage_type_parse, desc)

    try:
        attack_type = re.findall(attack_type_parse, desc)[0]
    except IndexError:
        return name, None, None, None, None, None

    if not damage_types:
        return name, None, None, None, None, None

    # Each dice in dice_damage should be XdX
    damage_dice_map = {}
    for dice in dice_damage:
        split_dice = dice.split('d')
        damage_dice_map[int(split_dice[1])] = int(split_dice[0])
    # Little hack to use the overall monster attr
    which_stat = [x for x in saves.items()
                  if len(x) > 1 and 'save' in x[0]
                  and bonus_damage
                  and x[1] == bonus_damage[0]]
    stat_for_bonus = which_stat[0][0][:3].upper() if which_stat else "STR"
    recharge_percentile = find_recharge_percentile(name)

    return name, damage_dice_map, stat_for_bonus, recharge_percentile, \
           damage_types[0], attack_type


stat_map = {
    "Dexterity": "DEX",
    "Strength": "STR",
    "Constitution": "CON",
    "Wisdom": "WIS",
    "Intelligence": "INT",
    "Charisma": "CHA"
}
aoe_type_search_str = "(\d\d?)-?(foot|ft\.)"
aoe_type_area_search_str = " (line|cone|radius|cube|within)"
aoe_save_search_str = "DC (\d\d?) (Dexterity|Strength|Constitution|Wisdom|Intelligence|Charisma)"
def parse_aoe_attack(action_element):
    # Check for multi-line entries.. default to first one
    name = action_element.find('name').text
    if len(list(action_element)) > 3:
        desc = action_element[2].text
    else:
        desc = action_element.find('text').text
    recharge_percentile = find_recharge_percentile(name)
    attack_text = action_element.find("attack").text
    damage_str = attack_text.split("|")[2]
    dice_damage = re.findall(damage_parse, damage_str)
    save = re.findall(aoe_save_search_str, desc)
    damage_types = re.findall(damage_type_parse, desc)
    aoe_range = re.findall(aoe_type_search_str, desc)
    aoe_type = re.findall(aoe_type_area_search_str, desc)
    if not aoe_type:
        print("Failed to find aoe_type from description:", desc)
    elif not aoe_range:
        print("Failed to find aoe_range from description:", desc)
    if not save or not aoe_type or not aoe_range:
        return name, None, None, None, None, None, None, None, None
    save_dc, save_stat = save[0]
    if aoe_type[0] == "within":
        aoe_type = ["radius"]
    aoe_type = "{} ft. {}".format(aoe_range[0][0], aoe_type[0])

    if not damage_types:
        print("Could not find damage type for description: {}".format(desc))
        return name, None, None, None, None, None, None, None, None

    damage_dice_map = {}
    for dice in dice_damage:
        split_dice = dice.split('d')
        damage_dice_map[int(split_dice[1])] = int(split_dice[0])

    return name, damage_dice_map, None, recharge_percentile, damage_types[0], \
        "AOE", int(save_dc), stat_map[save_stat], aoe_type


def parse_multi_attack_clause(clause, creature_name, action_mapping, failed):
    attacks = []
    clause = clause.strip()
    try:
        space_split = clause.split(" ")
        action_name = (creature_name + " - " + space_split[-1]).lower().strip()
        # Try the plural and non-plural version
        if action_name in action_mapping:
            attack = action_mapping[action_name]
        elif action_name[:-1] in action_mapping:
            attack = action_mapping[action_name[:-1]]
        else:
            raise KeyError
        count = count_mapping[words_re.search(clause)[0]]
        for _ in range(count):
            attacks.append(attack)
    except (KeyError, IndexError):
        try:
            space_split = clause.split(" ")
            action_name = (creature_name + " - " + space_split[-2]).lower()
            attack = action_mapping[action_name]
            count = count_mapping[words_re.search(clause)[0]]
            for _ in range(count):
                attacks.append(attack)
        except (KeyError, IndexError):
            failed = True
    except:
        failed = True
    return attacks, failed


def parse_multi_attack(multi_attack_element, creature_name, other_attacks):
    attack_description = multi_attack_element.find("text").text
    action_name_mapping = {a[0].name.lower(): a[0] for a in other_attacks}
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
                or_split = clause.split(" or ")
                clause_attacks, failed = parse_multi_attack_clause(
                    or_split[0], creature_name, action_name_mapping, failed)
            attacks.extend(clause_attacks)
    elif " or " in attack_description:
        multi_desc = attack_description.translate(translate_table)
        or_clauses = multi_desc.split(" or ")
        attacks, failed = parse_multi_attack_clause(
            or_clauses[0], creature_name, action_name_mapping, failed)
    else:
        attack_description = attack_description.translate(translate_table)
        attacks, failed = parse_multi_attack_clause(
            attack_description, creature_name, action_name_mapping, failed)
    if failed:
        print("Failed multi attack creation on:", attack_description)
        return None, None

    return ComboAttack(name=creature_name + " - Multi-attack"), attacks


def create_single_attack(name, stat_for_bonus, recharge_percentile, damage_type,
                         creature_name, attack_type, name_prefix="",
                         is_legendary=False, cost=0, save_stat=None,
                         save_dc=None, aoe_type=None):
    if attack_type == "Weapon":
        created_action = PhysicalSingleAttack(
            name=(name_prefix if name_prefix else creature_name) + " - " + name,
            stat_bonus=stat_for_bonus,
            damage_type=damage_type,
            bonus_to_hit=0,
            is_legendary=is_legendary,
            legendary_action_cost=cost,
            recharge_percentile=recharge_percentile
        )
    elif attack_type == "Spell":
        created_action = SpellSingleAttack(
            name=(name_prefix if name_prefix else creature_name) + " - " + name,
            stat_bonus=stat_for_bonus,
            damage_type=damage_type,
            bonus_to_hit=0,
            is_legendary=is_legendary,
            legendary_action_cost=cost,
            recharge_percentile=recharge_percentile
        )
    elif attack_type == "AOE":
        created_action = SpellSave(
            name=(name_prefix if name_prefix else creature_name) + " - " + name,
            stat_bonus=None,
            damage_type=damage_type,
            bonus_to_hit=0,
            save_stat=save_stat,
            save_dc=save_dc,
            is_aoe=True,
            aoe_type=aoe_type,
            recharge_percentile=recharge_percentile
        )
    else:
        raise RuntimeError("Did not get a valid attack type in "
                           "create_single_attack. Got {}".format(attack_type))
    return created_action


def parse_all_actions(action_elements, saves, creature_name):
    multi_attacks = []
    non_attacks = []
    attacks = []
    for element in list(action_elements):
        if element.find('attack') is not None:
            attacks.append(element)
        elif element.find('name').text == "Multiattack":
            multi_attacks.append(element)
        else:
            non_attacks.append(element)
    attack_infos = []
    mattack_infos = []
    aoe_infos = []
    for attack in attacks:
        if not attack:
            continue
        name, damage_dice_map, stat_for_bonus, recharge_percentile, \
            damage_type, attack_type = parse_attack(attack, saves)
        if attack_type is None:
            name, damage_dice_map, stat_for_bonus, recharge_percentile, \
                damage_type, attack_type, save_dc, \
                save_stat, aoe_type = parse_aoe_attack(attack)
            if aoe_type is None:
                print("ERROR on attack with name: {} from creature: {}".format(
                    name, creature_name))
                continue
            aoe_infos.append((create_single_attack(
                name, stat_for_bonus, recharge_percentile,
                damage_type, creature_name, attack_type, save_dc=save_dc,
                save_stat=save_stat, aoe_type=aoe_type), damage_dice_map))
        else:
            attack_infos.append((create_single_attack(
                name, stat_for_bonus, recharge_percentile,
                damage_type, creature_name, attack_type), damage_dice_map))
    for mattack in multi_attacks:
        if not mattack:
            continue
        mattack_infos.append(parse_multi_attack(
            mattack, creature_name, attack_infos))
    return attack_infos, mattack_infos, aoe_infos


def parse_legendary_actions(legendary_elements, other_actions):
    regular_actions = {e.name.lower().split("-")[1].strip(): (e, damage_dice)
                       for e, damage_dice in other_actions}

    def parse_single_legendary_action(legendary_element):
        name = legendary_element.find('name').text.lower()
        desc = legendary_element.find('text').text.lower()

        possible_actions = []
        matched_cost = re.findall("Costs (\d{1}) Actions", name)
        cost = int(matched_cost[0]) if matched_cost else 1
        for action_name, action in regular_actions.items():
            if action_name in name or action_name in desc:
                possible_actions.append(action)
        if not possible_actions:
            print("Could not find action to go with legendary action "
                  "name: {}".format(name))
        return [(a, damage_dice, cost) for a, damage_dice in possible_actions]

    parsed_actions = []
    for legendary_element in legendary_elements:
        parsed_actions.extend(parse_single_legendary_action(legendary_element))
    return parsed_actions


def create_dice_from_info(dice, action):
    created_dice = []
    for num_sides, num_dice in dice.items():
        created_dice.append(
            SingleAttackDice(attack=action,
                             num_dice=num_dice,
                             dice_id=dice_map[num_sides]))
    return created_dice


def create_and_save_attacks(combatant, attack_infos, mattack_infos,
                            laction_info, aoe_action_info):
    single_attack_dice = []
    mattack_components = []
    combatant_actions = []
    for attack, damage_dice_map in attack_infos:
        attack.save()
        single_attack_dice.extend(create_dice_from_info(damage_dice_map, attack))
        combatant_actions.append(CombatantAction(
            action=attack, combatant=combatant))
    for mattack, components in mattack_infos:
        if not mattack:
            continue
        mattack.save()
        for a in components:
            mattack_components.append(ComboAttackComponents(
                combo_attack=mattack,
                single_attack=a))
        combatant_actions.append(CombatantAction(
            action=mattack, combatant=combatant))
    for laction, damage_dice, cost in laction_info:
        attack_type = "Weapon" if isinstance(laction, PhysicalSingleAttack) else "Spell"
        created_action = create_single_attack(
            laction.name, laction.stat_bonus, laction.recharge_percentile,
            laction.damage_type, combatant.name, attack_type,
            name_prefix='Legendary Action', is_legendary=True, cost=cost)
        created_action.save()
        single_attack_dice.extend(
            create_dice_from_info(damage_dice, created_action))
        combatant_actions.append(CombatantAction(
            action=created_action, combatant=combatant))
    for aoe_action, damage_dice in aoe_action_info:
        aoe_action.save()
        single_attack_dice.extend(
            create_dice_from_info(damage_dice, aoe_action))
        combatant_actions.append(CombatantAction(
            action=aoe_action, combatant=combatant))
    SingleAttackDice.objects.bulk_create(single_attack_dice)
    CombatantAction.objects.bulk_create(combatant_actions)
    ComboAttackComponents.objects.bulk_create(mattack_components)


def parse_stats(monster_element):
    monster_attrs = {}
    action_elements = []
    legendary_elements = []
    for element in monster_element:
        if element.tag == "action":
            action_elements.append(element)
        elif element.tag == "legendary":
            legendary_elements.append(element)
        else:
            if element.tag not in element_tags:
                continue
            element_func, element_key = element_tags[element.tag]
            monster_attrs[element_key] = element_func(element)
    return monster_attrs, action_elements, legendary_elements


def parse_creature(monster_element):
    monster_attrs, action_elements, legendary_elements = parse_stats(
        monster_element)

    monster_attrs['num_legendary_actions'] = 3 if legendary_elements else 0
    monster_attrs['proficiency'] = proficiency_mapping[monster_attrs['cr']]
    combatant = Combatant(**monster_attrs)

    with transaction.atomic():
        combatant.save()

        attack_infos, mattack_infos, aoe_action_info = parse_all_actions(
            action_elements, monster_attrs, monster_attrs['name'])
        legendary_actions = parse_legendary_actions(
            legendary_elements, attack_infos)
        create_and_save_attacks(combatant, attack_infos, mattack_infos,
                                legendary_actions, aoe_action_info)


element_tags = {
    "str": (parse_save, "str_save"),
    "dex": (parse_save, "dex_save"),
    "con": (parse_save, "con_save"),
    "wis": (parse_save, "wis_save"),
    "int": (parse_save, "int_save"),
    "cha": (parse_save, "cha_save"),
    "name": (lambda x: x.text, "name"),
    "type": (parse_type, "combatant_type"),
    "ac": (lambda x: int(x.text.split(" ")[0]), "ac"),
    "hp": (lambda x: int(x.text.split(" ")[0]), "max_hp"),
    "speed": (parse_speed, "speed"),
    "cr": (lambda x: convert_challenge_rating(x.text), "cr")
}


def parse_file(file_name):
    tree = ET.parse("/Users/andrewdumit/Desktop/DnD/combat_simulator_v2/combat-simulator-api/xml_data/data/" + file_name)
    root = tree.getroot()
    for entry in root:
        parse_creature(entry)

# For testing purposes
# file_name = "Monster Manual Bestiary.xml"
# tree = ET.parse("/Users/andrewdumit/Desktop/DnD/combat_simulator_v2/combat-simulator-api/xml_data/data/" + file_name)
# root = tree.getroot()
# mon1 = [x for x in root if [e for e in x if e.text == 'Orc War Chief']][0]
# monster_attrs, action_elements, legendary_elements = parse_stats(
#         mon1)
# monster_attrs['num_legendary_actions'] = 3 if legendary_elements else 0
# monster_attrs['proficiency'] = proficiency_mapping[monster_attrs['cr']]
# combatant = Combatant(**monster_attrs)
# a1 = action_elements[1]
# a = action_elements[3]