# Define all damage types that can be used throughout the project
# These definitions avoid typos and enforce correct spelling

PIERCING = 'piercing'
SLASHING = 'slashing'
BLUDGEONING = 'bludgeoning'
FIRE = 'fire'
LIGHTNING = 'lightning'
RADIANT = 'radiant'
COLD = 'cold'
PSYCHIC = 'psychic'
ACID = 'acid'
NECROTIC = 'necrotic'
THUNDER = 'thunder'
POISON = 'poison'
FORCE = 'force'

DAMAGE_TYPE_CHOICES = (
    ("piercing", "piercing"),
    ("slashing", "slashing"),
    ("bludgeoning", "bludgeoning"),
    ("fire", "fire"),
    ("lightning", "lightning"),
    ("radiant", "radiant"),
    ("cold", "cold"),
    ("psychic", "psychic"),
    ("acid", "acid"),
    ("necrotic", "necrotic"),
    ("thunder", "thunder"),
    ("poison", "poison"),
    ("force", "force")
)

DAMAGE_TYPES = [x[0] for x in DAMAGE_TYPE_CHOICES]
