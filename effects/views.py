from django.http import JsonResponse

from effects.models import Effect


def get_all_effects(request):
    return JsonResponse([e.jsonify() for e in Effect.objects.all()], safe=False)
