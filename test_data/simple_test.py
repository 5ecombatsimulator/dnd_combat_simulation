
from simulation.battle_runner import BattleRunner


def run_goblin_v_goblin():
    br = BattleRunner()
    br.run_simulator(["Goblin"], ["Goblin"], 10)
    print(br.print_results())
