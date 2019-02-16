from django.http import JsonResponse

from utils.views import require_post_args, error_response
from simulation.battle_runner import BattleRunner


@require_post_args("team1", "team2")
def get_simulation_results(request):
    br = BattleRunner()
    team1 = request.POST.get("team1")
    team2 = request.POST.get("team2")
    if team1 == "" or team2 == "":
        return error_response(400, "Both teams must have at least 1 combatant!")
    br.run_simulator(team1.split(","),
                     team2.split(","),
                     200)
    return JsonResponse(br.get_results().to_json(), safe=False)
