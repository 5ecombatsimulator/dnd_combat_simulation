from json_data.convert_source_monsters import *

combatant_entry = [x for x in source if 'name' in x and x['name'] == "Storm Giant"][0]

# ---  Base attributes ---
creature_name = combatant_entry['name']
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

other_actions = []
multi_attack_description = None
if 'actions' not in combatant_entry:
    print("Error on creature with name: {}".format(creature_name))
else:
    for action in combatant_entry['actions']:
        if action['name'] == "Multiattack":
            multi_attack_description = action['desc']
        elif action['attack_bonus'] == 0:
            # Action is just some special effect.. figure out how to deal later
            pass
        else:
            try:
                action_object, damage_dice = create_attack(action, creature_name, cr, saves)
                if action:
                    other_actions.append((action_object, damage_dice, None))
            except KeyError:
                break
attack_description = multi_attack_description
action_name_mapping = {a[0].name.lower(): a[0] for a in other_actions}

