from actors.models import *
from actions.models import *
from effects.models import *


def flush():
    Combatant.objects.all().delete()
    PhysicalSingleAttack.objects.all().delete()
    SpellSingleAttack.objects.all().delete()
    SpellSave.objects.all().delete()
    ComboAttack.objects.all().delete()
    Effect.objects.all().delete()
    print("All entries deleted")
