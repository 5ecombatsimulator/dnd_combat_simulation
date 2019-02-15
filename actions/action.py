from random import random
from debug.logger import Logger


class Action:
    name = ""
    action_type = ""
    recharge_percentile = 0.0
    ready = True
    stat_bonus = "None"
    logger = Logger()

    def try_recharge(self):
        percentile = random()
        if percentile >= self.recharge_percentile:
            self.ready = True
