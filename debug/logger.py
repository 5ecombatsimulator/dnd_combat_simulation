from debug.debug_constants import DebugConstants as Constants
from simulation.settings import VERBOSITY


class Logger:
    levels = Constants()

    def log_info(self, msg):
        self.log(Logger.levels.INFO, "INFO: {0}".format(msg))

    def log_action(self, msg):
        self.log(Logger.levels.ACTION, "ACTION: {0}".format(msg))

    def log_death(self, msg):
        self.log(Logger.levels.DEATH, "DEATH: {0}".format(msg))

    def log_heuristic(self, msg):
        self.log(Logger.levels.HEURISTIC, "HEURISTIC: {0}".format(msg))

    def log(self, verbosity, msg):
        if verbosity <= VERBOSITY:
            print(msg)
