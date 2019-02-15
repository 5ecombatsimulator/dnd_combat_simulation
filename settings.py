import os

from simulator.src.debug.debug_constants import DebugConstants

# Base directory of the entire project
BASE_DIR = os.path.dirname(os.path.realpath(__file__)) + "/../../"
# Directory of the django project
BASE_PROJECT_DIR = os.path.dirname(os.path.realpath(__file__))

NUM_TRIALS = 1000

# debug_constants.py for debug constants and what they represent
VERBOSITY = DebugConstants.NONE

