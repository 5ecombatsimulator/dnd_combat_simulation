import math
import requests
import re

from django.db import transaction

from utils.dice import parse_dice_str
from actions.models import Action
from actors.models import Combatant


stat_id_map = {
    'Strength': 1,
    'STR': 1,
    'Dexterity': 2,
    'DEX': 2,
    'Constitution': 3,
    'CON': 3,
    'Intelligence': 4,
    'INT': 4,
    'Wisdom': 5,
    'WIS': 5,
    'Charisma': 6,
    'CHA': 6,
}

stat_id_to_str = {v: k for k, v in stat_id_map.items()}
dex_based_props = {'Range', ' Finesse'}

count_map = {
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10
}

# unparsed_spells = []


def get_stat_data(stat, char_data, debug=False):
    locations_of_updates = []

    stat_id = stat_id_map[stat]
    stat_val = None
    for stat_dict in char_data['stats']:
        if stat_dict['id'] == stat_id:
            stat_val = stat_dict['value']

    for mod_key, modifiers in char_data['modifiers'].items():
        if not modifiers:
            continue
        for mod_dict in modifiers:
            if mod_dict['subType'] == f"{stat.lower()}-score":
                stat_val += mod_dict['fixedValue']
                locations_of_updates.append(
                    (mod_key, mod_dict['subType'], mod_dict['fixedValue']))

    if debug:
        print(locations_of_updates)
    return stat_val


def stat_into_modifier(stat_val):
    return math.floor((int(stat_val) - 10) / 2)


def get_level(char_data):
    return sum(d['level'] for d in char_data['classes'])


def get_hp(char_data):
    # TODO: Add in things from modifiers such as the "Tough" feat etc.
    con_mod = stat_into_modifier(get_stat_data('Constitution', char_data))
    contribution_from_con = get_level(char_data) * con_mod
    return char_data['baseHitPoints'] + contribution_from_con


def get_ac(char_data, debug=False):
    locations_of_updates = []
    dex_bonus = stat_into_modifier(get_stat_data('Dexterity', char_data))
    base_ac = 10 + dex_bonus
    add_shield = False
    for item_dict in char_data['inventory']:
        if (item_dict['equipped'] and
                item_dict['definition']['armorClass'] is not None):
            if item_dict['definition']['baseArmorName'] == 'Shield':
                add_shield = True
            else:
                base_ac = item_dict['definition']['armorClass']
                if item_dict['definition']['armorTypeId'] == 1:
                    base_ac += dex_bonus
                    locations_of_updates.append(
                        ("Light armor - dex bonus", dex_bonus))
                elif item_dict['definition']['armorTypeId'] == 2:
                    base_ac += min(2, dex_bonus)
                    locations_of_updates.append(
                        ("Med armor - dex bonus", dex_bonus))
            locations_of_updates.append((item_dict.get('name', ''),
                                         item_dict['definition'][
                                             'baseArmorName'],
                                         item_dict['definition']['armorClass']))

    possible_unarmored_mods = []
    for mod_key, modifiers in char_data['modifiers'].items():
        if not modifiers:
            continue
        for mod_dict in modifiers:
            if mod_dict['friendlySubtypeName'] == "Armor Class":
                base_ac += mod_dict['fixedValue']
                locations_of_updates.append((mod_key, mod_dict['fixedValue']))
            elif mod_dict['friendlySubtypeName'] == 'Unarmored Armor Class':
                possible_unarmored_mods.append(mod_dict['statId'])
                locations_of_updates.append((mod_key, mod_dict['statId']))

    if add_shield:
        base_ac += 2

    if possible_unarmored_mods:
        ac_mods = [stat_into_modifier(
            get_stat_data(stat_id_to_str[stat_id], char_data))
                   for stat_id in possible_unarmored_mods]
        base_ac += max(ac_mods)

    if debug:
        print(locations_of_updates)
    return base_ac


def get_proficiency(char_data):
    total_level = get_level(char_data)
    if total_level < 5:
        return 2
    elif total_level < 9:
        return 3
    elif total_level < 13:
        return 4
    elif total_level < 17:
        return 5
    return 6


def compute_save_dc(char_data, stat):
    prof = get_proficiency(char_data)
    stat_into_mod = stat_into_modifier(get_stat_data(stat, char_data))
    return 8 + prof + stat_into_mod


def get_class_casting_stat(char_data):
    for class_info in char_data['classes']:
        class_name = class_info['definition']['name']
        if class_name in ['Monk', 'Ranger', 'Cleric', 'Druid']:
            return 'WIS'
        elif class_name in ['Wizard', 'Artificer', 'Fighter', 'Rogue']:
            return 'INT'
        elif class_name in ['Warlock', 'Sorcerer', 'Bard', 'Paladin']:
            return 'CHA'
    classes = char_data['classes']
    raise RuntimeError(f"NEW CLASS in get_class_casting_stat: {classes}")


def check_for_spell_save_dc_bonueses(char_data):
    total_bonus = 0
    for item in char_data['inventory']:
        if not item['equipped']:
            continue
        for mod in item['definition']['grantedModifiers']:
            if mod['friendlySubtypeName'] == "Spell Save DC" \
                    and mod['friendlyTypeName'] == "Bonus":
                total_bonus += mod['value']
    return total_bonus


def get_spell_save_dc(char_data):
    base_dc = compute_save_dc(char_data, get_class_casting_stat(char_data))
    dc_bonuses = check_for_spell_save_dc_bonueses(char_data)
    return base_dc + dc_bonuses


def check_num_targets(spell_desc):
    found_counts = re.findall("up to {two|three|four|five|six|seven|eight|nine|ten} [creatures|targets]", spell_desc)
    if found_counts:
        return count_map[found_counts[0]]
    else:
        return 1


def parse_single_item_kwargs(item_data, char_data):
    item_def = item_data['definition']
    item_name = item_def['name']
    kwargs = {'action_type': 'PhysicalSingleAttack',
              'name': item_name + " - " + char_data['name'],
              'is_legendary': False,
              'dice': parse_dice_str(item_def['damage']['diceString']),
              'damageType': item_def['damageType'].lower()}
    weapon_props = {p['name'] for p in item_def['properties']}
    kwargs['stat_bonus'] = 'DEX' if weapon_props.intersection(
        dex_based_props) else 'STR'
    kwargs['description'] = item_def['description']
    return kwargs


def get_inventory_actions(char_data):
    items_with_damage = [x for x in char_data['inventory']
                         if x['equipped'] and x['definition']['damage']]
    all_item_kwargs = []
    for item in items_with_damage:
        item_kwargs = parse_single_item_kwargs(item, char_data)
        all_item_kwargs.append(item_kwargs)
    return all_item_kwargs


def check_mod_for_dice(modifier):
    if modifier['die'] and modifier['die']['diceString'] is not None:
        return True
    return False


def parse_spell_type(spell_def):
    for mod in spell_def['modifiers']:
        if mod['subType'] == 'hit-points':
            return 'Heal'
    if spell_def['requiresSavingThrow']:
        return 'SpellSave'
    elif spell_def['requiresAttackRoll']:
        return 'SpellSingleAttack'
    # Helper for debugging new spell types
    # spell_name = spell_def['name']
    # unparsed_spells.append(spell_name)
    return None
#     raise RuntimeError(f"New type of spell type for: {spell_name}")


def parse_single_spell_action(spell_def, char_data):
    """

    TODO: Need to add in the getting of spell effects for each action

    Args:
        spell_def:
        char_data:

    Returns:

    """
    action_type = parse_spell_type(spell_def)
    if action_type is None:
        return {}
    kwargs = {'action_type': action_type,
              'name': spell_def['name'] + " - " + char_data['name'],
              'description': spell_def['description'],
              'is_legendary': False}

    if action_type == 'Heal':
        dice_dict = {}
        for mod in spell_def['modifiers']:
            if check_mod_for_dice(mod):
                dice_dict.update(
                    parse_dice_str(mod['die']['diceString']).items())
        kwargs['dice'] = dice_dict
        kwargs['num_targets'] = check_num_targets(spell_def['description'])

    elif action_type == 'SpellSave':
        kwargs['save_stat'] = stat_id_to_str[spell_def['saveDcAbilityId']]
        kwargs['save_dc'] = get_spell_save_dc(char_data)
        kwargs['damage_type'] = None

        check_higher_cast = False
        if spell_def['level'] == 0:
            check_higher_cast = True

        damage_dice = {}
        for mod in spell_def['modifiers']:
            if check_mod_for_dice(mod):
                level_dice = mod['die']['diceString']

                if check_higher_cast:
                    current_level = get_level(char_data)
                    for higher_level_def in mod['atHigherLevels'][
                        'higherLevelDefinitions']:
                        if current_level >= higher_level_def['level']:
                            level_dice = higher_level_def['dice']['diceString']
                parsed_dice = parse_dice_str(level_dice)
                if parsed_dice is None:
                    raise RuntimeError("Broken dice on action:", kwargs['name'])
                damage_dice.update(parsed_dice.items())

                # This must be inside so that we get the subtype related to the
                # damage part of this
                if mod['friendlySubtypeName']:
                    kwargs['damage_type'] = mod['friendlySubtypeName'].lower()
        kwargs['dice'] = damage_dice
        aoe_type = spell_def['range']['aoeType']
        kwargs['is_aoe'] = aoe_type is not None and aoe_type != ''
        if kwargs['is_aoe']:
            aoe_value = spell_def['range']['aoeValue']
            range_value = spell_def['range']['rangeValue']
            if aoe_type is None:
                raise TypeError("Aoe_type is None for is_aoe=True\n", spell_def)
            elif aoe_value is None and range_value is None:
                raise TypeError(
                    "Aoe_value and range_value are None for is_aoe=True.\n",
                    spell_def)
            elif aoe_value and range_value:
                # This is OKAY for spells that have a range and an AoE, some
                # spells that are AoE only have a range however.
                # print(spell_def['name'], f"aoe_value={aoe_value},
                #       range_value={range_value}")
                # raise TypeError("Aoe_value and range_value are both not
                #                  None for is_aoe=True.\n", spell_def)
                pass
            elif not aoe_value and range_value:
                print(spell_def['name'],
                      f"aoe_value={aoe_value}, range_value={range_value}")
                pass
            aoe_value = aoe_value or range_value
            kwargs['aoe_type'] = f"{aoe_value} ft. {aoe_type.lower()}"

    elif action_type == 'SpellSingleAttack':
        kwargs['damage_type'] = None
        kwargs['stat_bonus'] = get_class_casting_stat(char_data)
        kwargs['is_aoe'] = False

        # For cantrips
        check_higher_cast = False
        if spell_def['level'] == 0:
            check_higher_cast = True

        damage_dice = {}
        for mod in spell_def['modifiers']:
            if check_mod_for_dice(mod):
                level_dice = mod['die']['diceString']
                if check_higher_cast:
                    current_level = get_level(char_data)
                    for higher_level_def in mod['atHigherLevels'][
                        'higherLevelDefinitions']:
                        if current_level >= higher_level_def['level']:
                            level_dice = higher_level_def['dice']['diceString']
                damage_dice.update(parse_dice_str(level_dice).items())

                if mod['friendlySubtypeName']:
                    kwargs['damage_type'] = mod['friendlySubtypeName'].lower()
        kwargs['dice'] = damage_dice
    return kwargs


def get_spell_actions(char_data):
    """

    Args:
        char_data:

    Returns:

    """
    kwarg_list = []
    for class_spell_info in char_data['classSpells']:
        spells = class_spell_info['spells']
        for spell in spells:
            spell_def = spell['definition']
            action_kwargs = parse_single_spell_action(spell_def, char_data)
            if not action_kwargs:
                continue
            kwarg_list.append(action_kwargs)
    return kwarg_list


def clean_actions(actions):
    cleaned_actions = []
    for action in actions:
        cleaned_action = {}
        for k, v in action.items():
            if v is None or v == {}:
                continue
            else:
                cleaned_action[k] = v
        cleaned_actions.append(cleaned_action)
    # TODO: Remove this line once status spells are accounted for.
    #  E.g. hold person
    filtered_actions = [a for a in cleaned_actions if 'damage_type' in a.keys()]
    return filtered_actions


def get_actions(char_data):
    spell_action_kwargs = get_spell_actions(char_data)
    inventory_actions = get_inventory_actions(char_data)
    full_actions = spell_action_kwargs + inventory_actions
    cleaned_actions = clean_actions(full_actions)
    return cleaned_actions


@transaction.atomic
def parse_character(url):
    req_data = requests.get(url)
    char_data = req_data.json()['data']
    actions = get_actions(char_data)
    for action_kwargs in actions:
        try:
            action_msg, created_action = Action.create_action(**action_kwargs)
        except Exception as e:
            print("Failed on:", action_kwargs['name'])
            print("Kwargs:", action_kwargs)
            raise e
        if action_msg != "Success":
            raise RuntimeError(f"Failed to create {action_kwargs['name']} "
                               f"because of: {action_msg}")
    action_names = [a['name'] for a in actions]
    msg = Combatant.create(
        name=char_data['name'],
        hp=get_hp(char_data),
        ac=get_ac(char_data),
        proficiency=get_proficiency(char_data),
        strength=get_stat_data('Strength', char_data),
        dexterity=get_stat_data('Dexterity', char_data),
        constitution=get_stat_data('Constitution', char_data),
        wisdom=get_stat_data('Wisdom', char_data),
        intelligence=get_stat_data('Intelligence', char_data),
        charisma=get_stat_data('Charisma', char_data),
        cr=get_level(char_data),
        actions=",".join(action_names))
    return msg
