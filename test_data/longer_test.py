import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "combat-simulator-api.settings")
import django
django.setup()

from simulation.battle_runner import BattleRunner

br = BattleRunner()
br.run_simulator(["Goblin", "Goblin"], ["Goblin"], 100)
