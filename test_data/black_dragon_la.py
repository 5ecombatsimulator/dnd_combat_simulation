from actions.models import *
from actors.models import *
from simulation.battle_runner import BattleRunner


def create_black_dragon_legendary_action():
    bdragon = Combatant.objects.get(name="Adult Black Dragon")
    bdragon.num_legendary_actions = 3
    claw_attack = CombatantAction.objects.get(
        combatant=bdragon, action__name="Adult Black Dragon - Claw").action
    legendary_claw_attack = PhysicalSingleAttack(
        name="Legendary action - Adult Black Dragon - Claw",
        is_legendary=True,
        legendary_action_cost=1,
        bonus_to_damage=claw_attack.bonus_to_damage,
        bonus_to_hit=claw_attack.bonus_to_hit,
        stat_bonus=claw_attack.stat_bonus
    )
    bdragon.save()
    legendary_claw_attack.save()
    CombatantAction(action=legendary_claw_attack, combatant=bdragon).save()
    for d in claw_attack.singleattackdice_set.all():
        SingleAttackDice(
            attack=legendary_claw_attack,
            dice=d.dice, num_dice=d.num_dice).save()


def fight_black_dragon():
    br = BattleRunner()
    br.run_simulator(["Adult Black Dragon"], ["Goblin"] * 5, 10)
    print(br.print_results())
