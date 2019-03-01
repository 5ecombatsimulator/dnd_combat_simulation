from random import randint


def calc_roll(dice):
    """
    :param dice: A dictionary of (faces, amount) pairs
    """
    total = 0
    for max_roll, num_dice in dice.items():
        total += sum(map(lambda x: randint(1, max_roll), range(num_dice)))
    return total


def d20():
    # Roll a d20
    return randint(1, 20)


def load_dice(dice):
    """ Load a dictionary of dice from json into a usable dice object.

        When the dice are read from a JSON file, the key is a string, so must
         be turned into an integer here.
    """
    return {int(k): v for k, v in dice.items()}


def parse_dice_str(dice_str):
    """ Parses a string that and returns a dice dict

    Examples:
        3d6 => {6:3}
        4d6+1d8 => {8:1, 6:4}

    Args:
        dice_str (str): string to be parsed

    Returns:
        a dict of int: int with the key being the number of sides of a dice
        and the value being the number of dice.
    """
    print(dice_str)
    split_char = " "
    for char in ",+":
        if char in dice_str:
            split_char = char
            break
    split_str = dice_str.split(split_char)

    dice_dict = {}
    for entry in split_str:
        entry_split = entry.split("d")
        dice_dict[int(entry_split[1])] = int(entry_split[0])
    return dice_dict
