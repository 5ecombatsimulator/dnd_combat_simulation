from django.http import JsonResponse

from actions.models import Action, SingleAttackDice
from actions.damage_types import DAMAGE_TYPE_CHOICES
from utils.dice import parse_dice_str


def get_all_actions(request):
    return JsonResponse([a.jsonify() for a in Action.objects.all()], safe=False)


def get_all_damage_types(request):
    return JsonResponse([{'label': x[0][0].upper() + x[0][1:], 'value': x[0]}
                         for x in DAMAGE_TYPE_CHOICES], safe=False)


action_args = {
    'name',
    'recharge_percentile',
    'stat_bonus',
    'is_legendary',
    'legendary_action_cost',
    'effects',
    'multi_attack',
    'is_aoe',
    'aoe_type',
    'damage_type',
    'save_stat',
    'save_dc',
    'dice',
    'bonus_to_hit',
    'bonus_to_damage',

}
def create_action(request):
    arg_dict = {}
    for arg in action_args:
        if arg in request.POST:
            arg_dict[arg] = request.POST.get(arg)
    action_type = request.POST.get('action_type')
    # Parse dice into useful string
    dice = parse_dice_str(request.POST.get('dice'))
    arg_dict['dice'] = dice
    msg, action = Action.create_action(action_type, **arg_dict)
    return JsonResponse({
        'msg': msg,
        'actions': [a.jsonify() for a in Action.objects.all()]
    }, safe=False)
