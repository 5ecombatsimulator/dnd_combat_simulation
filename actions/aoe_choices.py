"""

This file defines the possible aoe definitions and their effects

"""
from math import ceil


LINE_15 = "15 ft. line"
LINE_20 = "20 ft. line"
LINE_30 = "30 ft. line"
LINE_40 = "40 ft. line"
LINE_60 = "60 ft. line"
LINE_90 = "90 ft. line"
LINE_100 = "100 ft. line"
LINE_120 = "120 ft. line"

SPHERE_5 = "5 ft. sphere"
SPHERE_10 = "10 ft. sphere"
SPHERE_15 = "15 ft. sphere"
SPHERE_20 = "20 ft. sphere"
SPHERE_30 = "30 ft. sphere"

RADIUS_10 = "10 ft. radius"
RADIUS_20 = "20 ft. radius"
RADIUS_30 = "30 ft. radius"
RADIUS_60 = "60 ft. radius"
RADIUS_120 = "120 ft. radius"

CONE_15 = "15 ft. cone"
CONE_30 = "30 ft. cone"
CONE_60 = "60 ft. cone"
CONE_90 = "90 ft. cone"
CONE_120 = "120 ft. cone"

CUBE_10_ALT = "10 ft. cube"
CUBE_20_ALT = "20 ft. cube"
CUBE_30_ALT = "30 ft. cube"
CUBE_10 = "10 ft. radius cube"
CUBE_20 = "20 ft. radius cube"
CUBE_30 = "30 ft. radius cube"

CYLINDER_10 = "10 ft. cylinder"
CYLINDER_20 = "20 ft. cylinder"
CYLINDER_30 = "30 ft. cylinder"

AOE_CHOICES = (
    (LINE_120, LINE_120),
    (LINE_100, LINE_100),
    (LINE_90, LINE_90),
    (LINE_60, LINE_60),
    (LINE_40, LINE_40),
    (LINE_30, LINE_30),
    (LINE_20, LINE_20),
    (LINE_15, LINE_15),

    (SPHERE_5, SPHERE_5),
    (SPHERE_10, SPHERE_10),
    (SPHERE_15, SPHERE_15),
    (SPHERE_20, SPHERE_20),
    (SPHERE_30, SPHERE_30),

    (RADIUS_10, RADIUS_10),
    (RADIUS_20, RADIUS_20),
    (RADIUS_30, RADIUS_30),
    (RADIUS_60, RADIUS_60),
    (RADIUS_120, RADIUS_120),

    (CONE_15, CONE_15),
    (CONE_30, CONE_30),
    (CONE_60, CONE_60),
    (CONE_90, CONE_90),
    (CONE_120, CONE_120),

    (CUBE_10, CUBE_10),
    (CUBE_20, CUBE_20),
    (CUBE_30, CUBE_30),
    (CUBE_10_ALT, CUBE_10_ALT),
    (CUBE_20_ALT, CUBE_20_ALT),
    (CUBE_30_ALT, CUBE_30_ALT),

    (CYLINDER_10, CYLINDER_10),
    (CYLINDER_20, CYLINDER_20),
    (CYLINDER_30, CYLINDER_30),
)
AOE_PERCENT_HIT_MAP = {
    LINE_15: lambda x: max(ceil(x * 0.15), 2),
    LINE_20: lambda x: max(ceil(x * 0.25), 2),
    LINE_30: lambda x: max(ceil(x * 0.25), 2),
    LINE_40: lambda x: max(ceil(x * 0.33), 2),
    LINE_60: lambda x: max(ceil(x * 0.33), 2),
    LINE_90: lambda x: max(ceil(x * 0.33), 2),
    LINE_100: lambda x: max(ceil(x * 0.33), 2),
    LINE_120: lambda x: max(ceil(x * 0.33), 2),

    SPHERE_5: lambda x: 1,
    SPHERE_10: lambda x: max(ceil(x * 0.1), 1),
    SPHERE_15: lambda x: max(ceil(x * 0.33), 1),
    SPHERE_20: lambda x: max(ceil(x * 0.33), 2),
    SPHERE_30: lambda x: max(ceil(x * 0.5), 2),

    RADIUS_10: lambda x: max(ceil(x * 0.25), 1),
    RADIUS_20: lambda x: max(ceil(x * 0.33), 1),
    RADIUS_30: lambda x: max(ceil(x * 0.5), 1),
    RADIUS_60: lambda x: max(ceil(x * 0.66), 1),
    RADIUS_120: lambda x: max(ceil(x * 1.0), 1),

    CONE_15: lambda x: max(ceil(x * 0.25), 1),
    CONE_30: lambda x: max(ceil(x * 0.33), 1),
    CONE_60: lambda x: max(ceil(x * 0.5), 1),
    CONE_90: lambda x: max(ceil(x * 0.5), 1),
    CONE_120: lambda x: max(ceil(x * 1.0), 1),

    CUBE_10: lambda x: max(ceil(x * 0.2), 1),
    CUBE_20: lambda x: max(ceil(x * 0.3), 1),
    CUBE_30: lambda x: max(ceil(x * 0.5), 1),
    CUBE_10_ALT: lambda x: max(ceil(x * 0.2), 1),
    CUBE_20_ALT: lambda x: max(ceil(x * 0.3), 1),
    CUBE_30_ALT: lambda x: max(ceil(x * 0.5), 1),

    CYLINDER_10: lambda x: max(ceil(x * 0.2), 1),
    CYLINDER_20: lambda x: max(ceil(x * 0.33), 2),
    CYLINDER_30: lambda x: max(ceil(x * 0.5), 2),
}

