"""

This file defines the possible aoe definitions and their effects

"""
from math import ceil


LINE_120 = "120 ft. line"
LINE_90 = "90 ft. line"
LINE_60 = "60 ft. line"
LINE_40 = "40 ft. line"
LINE_30 = "30 ft. line"
LINE_20 = "20 ft. line"
LINE_15 = "15 ft. line"

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

CUBE_10 = "10 ft. radius cube"
CUBE_20 = "20 ft. radius cube"
CUBE_30 = "30 ft. radius cube"

AOE_CHOICES = (
    (LINE_120, LINE_120),
    (LINE_90, LINE_90),
    (LINE_60, LINE_60),
    (LINE_40, LINE_40),
    (LINE_30, LINE_30),
    (LINE_20, LINE_20),
    (LINE_15, LINE_15),
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
    (CUBE_30, CUBE_30)
)

AOE_PERCENT_HIT_MAP = {
    LINE_120: lambda x: max(ceil(x * 0.33), 2),
    LINE_90: lambda x: max(ceil(x * 0.33), 2),
    LINE_60: lambda x: max(ceil(x * 0.33), 2),
    LINE_40: lambda x: max(ceil(x * 0.33), 2),
    LINE_30: lambda x: max(ceil(x * 0.25), 2),
    LINE_20: lambda x: max(ceil(x * 0.25), 2),
    LINE_15: lambda x: max(ceil(x * 0.15), 2),
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
}