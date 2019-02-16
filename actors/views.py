from django.http import JsonResponse

from actors.models import Combatant


def get_combatants(request):
    all_combatants = Combatant.objects.all()
    return JsonResponse([c.jsonify() for c in all_combatants], safe=False)
