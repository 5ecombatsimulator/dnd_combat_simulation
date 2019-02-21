
from simulation.battle_runner import BattleRunner


def run_goblin_v_goblin():
    br = BattleRunner()
    br.run_simulator(["Young Black Dragon"], ["Goblin"] * 10, 1)
    print(br.print_results())
