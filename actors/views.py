from django.http import JsonResponse

from actors.models import Combatant
from utils.views import error_response
from actors.dndbeyond_import import parse_character


def get_combatants(request):
    all_combatants = Combatant.objects.all()
    return JsonResponse([c.jsonify() for c in all_combatants], safe=False)


def create_combatant(request):
    post = request.POST
    msg = Combatant.create(
        name=post.get("name", None),
        hp=post.get("hp", 0),
        ac=post.get("ac", 0),
        proficiency=post.get("proficiency", 0),
        strength=post.get("strength", -1),
        dexterity=post.get("dexterity", -1),
        constitution=post.get("constitution", -1),
        wisdom=post.get("wisdom", -1),
        intelligence=post.get("intelligence", -1),
        charisma=post.get("charisma", -1),
        cr=post.get("cr", 1),
        actions=post.get('actions', [])
    )
    if msg != "Success":
        return JsonResponse({'msg': msg})
    return JsonResponse({
        'msg': msg,
        "combatants": [c.jsonify() for c in Combatant.objects.all()]
    }, safe=False)


def load_combatant(request, combatant_name):
    combatant = Combatant.objects.get(name=combatant_name)
    return JsonResponse({"combatant": combatant.jsonify(jsonify_actions=True)},
                        safe=False)


def import_combatant_from_ddb(request):
    character_url = request.get('ddb_url', None)
    return JsonResponse({"combatant": parse_character(
        character_url).jsonify(jsonify_actions=True)}, safe=False)

