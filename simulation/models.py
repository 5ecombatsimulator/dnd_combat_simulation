from random import choice
import string

from django.db import models, transaction


from actors.models import Combatant


class SavedBattle(models.Model):
    KEY_CHARACTERS = string.ascii_letters + string.digits + "!-_@#$%^"

    battle_key = models.CharField(max_length=64)
    combatants = models.ManyToManyField(
        Combatant, through="BattleCombatant")

    @classmethod
    def _create_battle_key(cls):
        key_str = ""
        for _ in range(64):
            key_str += choice(cls.KEY_CHARACTERS)
        return key_str

    @classmethod
    def save_battle(cls, team1_names, team2_names):
        battle_key = cls._create_battle_key()
        battle = SavedBattle(battle_key=battle_key)
        with transaction.atomic():
            battle.save()
            battle_combatants = []
            for name in team1_names:
                try:
                    combatant = Combatant.objects.get(name=name)
                except Combatant.DoesNotExist:
                    return "Could not find combatant with name {}".format(
                        name), ""
                battle_combatants.append(BattleCombatant(
                    battle=battle, combatant=combatant, team=1))
            for name in team2_names:
                try:
                    combatant = Combatant.objects.get(name=name)
                except Combatant.DoesNotExist:
                    return "Could not find combatant with name {}".format(
                        name), ""
                battle_combatants.append(BattleCombatant(
                    battle=battle, combatant=combatant, team=2))
            BattleCombatant.objects.bulk_create(battle_combatants)
        return "Successfully saved", battle_key

    @staticmethod
    def load_combatants_from_key(key):
        try:
            battle = SavedBattle.objects.get(battle_key=key)
        except SavedBattle.DoesNotExist:
            return "Could not find battle with key {}".format(key), [], []
        team1 = Combatant.objects.filter(
            battlecombatant__battle=battle, battlecombatant__team=1)
        team2 = Combatant.objects.filter(
            battlecombatant__battle=battle, battlecombatant__team=2)
        return "Success", team1, team2


class BattleCombatant(models.Model):
    combatant = models.ForeignKey(Combatant, on_delete=models.CASCADE)
    battle = models.ForeignKey(SavedBattle, on_delete=models.CASCADE)
    team = models.PositiveSmallIntegerField()


class SimulatedBattle(models.Model):
    simulated_time = models.DateTimeField(auto_now_add=True)


class SimulatedCombatant(models.Model):
    team = models.PositiveSmallIntegerField()
    combatant = models.ForeignKey(Combatant, on_delete=models.PROTECT)
    battle = models.ForeignKey(SimulatedBattle, on_delete=models.PROTECT)

