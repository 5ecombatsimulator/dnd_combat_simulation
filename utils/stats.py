from math import floor


def convert_stat_to_bonus(stat_value):
    """ Converts a real-valued stat to the bonus that it represents

    Example: 18 strength -> +4

    Args:
        stat_value: the integer denoting the value of the stat to be converted

    Returns:
        stat_bonus: The bonus that the statistic value represents
    """
    return floor((stat_value - 10)/2)
