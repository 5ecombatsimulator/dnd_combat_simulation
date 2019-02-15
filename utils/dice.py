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
