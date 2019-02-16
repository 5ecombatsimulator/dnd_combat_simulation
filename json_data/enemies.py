from json_data.attacks import *
from simulation.heuristics.heuristic_container import HeuristicContainer
from simulation.heuristics.target_selection_heuristics import HighestAC

from actors.combatant import Combatant


def goblin():
    return Combatant(name="Goblin", hp=7, ac=14, proficiency=1,
                     saves={"STR": 1, "CON": 1, "DEX": 1, "INT": 1, "WIS": 1, "CHA": 1},
                     actions=[short_sword_slash()],
                     heuristics=HeuristicContainer(attack_selection=HighestAC()))


def hobgoblin():
    return Combatant(name="Hobgoblin", hp=11, ac=18, proficiency=2,
                     saves={"STR": 1, "CON": 1, "DEX": 1, "INT": 1, "WIS": 1, "CHA": 1},
                     actions=[longsword_attack()])


def griffon():
    return Combatant(name="Griffon", hp=59, ac=12, proficiency=2,
                     saves={"STR": 4, "CON": 3, "DEX": 2, "INT": -4, "WIS": 1, "CHA": -1},
                     actions=[griffon_combo()])






