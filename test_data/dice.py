from dice.models import Dice


def gen_dice():
    for nsides in range(1, 100):
        d = Dice(num_sides=nsides)
        d.save()
