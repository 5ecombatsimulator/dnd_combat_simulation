from django.http import JsonResponse

from effects.models import Effect, get_effect_list


def get_all_effects(request):
    return JsonResponse([e.jsonify() for e in Effect.objects.all()], safe=False)


def get_all_effect_types(request):
    return JsonResponse([
        {"value": e_type, "label":e_type} for e_type in get_effect_list()
    ], safe=False)


def create_effect(request):
    effect, msg = Effect.create_effect(
        name=request.POST.get("name"),
        max_turns=request.POST.get("num_turns"),
        save_stat=request.POST.get("save_stat"),
        save_dc=request.POST.get("save_dc"),
        damage_dice=request.POST.get("damage_dice"),
        effect_type=request.POST.get("effect_type"),
    )
    return JsonResponse({'msg': msg})
