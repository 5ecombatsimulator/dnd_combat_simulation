from actions.models import *
from actors.models import *

def goblin():
    g = Combatant(
        name='Goblin',
        max_hp=7,
        ac=14,
        proficiency=1,
        str_save=1,
        dex_save=1,
        con_save=1,
        int_save=1,
        wis_save=1,
        cha_save=1,
        cr=0.5
    )
    g.save()

    slash = PhysicalSingleAttack.objects.get(
        name='Short sword')
    CombatantAction(
        combatant=g,
        action=slash
    ).save()
