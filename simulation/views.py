from django.http import JsonResponse
import json
from itertools import groupby

from utils.views import require_post_args, error_response
from simulation.models import SavedBattle
from simulation.battle_runner import BattleRunner

def convert_team_to_list(team):
    return [k for k, v in json.loads(team).items() for x in range(int(v['quantity']))]

def convert_list_to_team(l):
    lst = [c.jsonify() for c in l]
    return {k: {'quantity': len(list(v))} for k, v in groupby(lst, key=lambda x:x['value'])}

@require_post_args("team1", "team2")
def get_simulation_results(request):
    br = BattleRunner()
    team1 = request.POST.get("team1")
    team2 = request.POST.get("team2")
    if team1 == "" or team2 == "":
        return error_response(400, "Both teams must have at least 1 combatant!")
    br.run_simulator(convert_team_to_list(team1),
                     convert_team_to_list(team2),
                     200)
    return JsonResponse(br.get_results().to_json(), safe=False)


@require_post_args("team1", "team2")
def save_battle(request):
    team1_names = request.POST.get("team1")
    team2_names = request.POST.get("team2")
    if team1_names == "" or team2_names == "":
        return error_response(400, "Both teams must have at least 1 combatant!")
    msg, battle_key = SavedBattle.save_battle(
        convert_team_to_list(team1_names),
        convert_team_to_list(team2_names))
    return JsonResponse({'msg': msg, "battleKey": battle_key})


@require_post_args('battle_key')
def load_battle(request):
    battle_key = request.POST.get('battle_key')
    print(battle_key)
    msg, team1, team2 = SavedBattle.load_combatants_from_key(
        battle_key)
    return JsonResponse({
        'msg': msg,
        'team1': convert_list_to_team(team1),
        'team2': convert_list_to_team(team2)}, safe=False) 
