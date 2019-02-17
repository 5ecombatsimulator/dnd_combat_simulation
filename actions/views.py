from django.http import JsonResponse

from actions.models import Action


def get_all_actions(request):
    return JsonResponse([a.jsonify() for a in Action.objects.all()], safe=False)
