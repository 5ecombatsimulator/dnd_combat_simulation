import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "combat-simulator-api.settings")
import django
django.setup()

from simulation.battle_runner import BattleRunner

br = BattleRunner()
def run_sim():
    br.run_simulator(["Adult Black Dragon"], ["Goblin"] * 150, 10)
    print(br.print_results())
