from dice.models import Dice


def gen_dice():
    for nsides in [4, 6, 8, 10, 12, 20]:
        d = Dice(num_sides=nsides)
        d.save()
