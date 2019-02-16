import random
from simulation.heuristics.heuristic import Heuristic


# Heuristic types-------------------------
class TargetSelectionHeuristic(Heuristic):
    def __init__(self):
        super().__init__()

    def log_target_selection(self, target, method):
        name = "None"
        if target:
            name = target.name
        self.logger.log_heuristic("Selected target {0} with method: {1}".format(name, method))

    def select(self, targets):
        raise NotImplementedError("Heuristic select method has not been implemented!")


class Random(TargetSelectionHeuristic):
    def __init__(self):
        super().__init__()

    def select(self, targets):
        target = random.choice(targets)
        self.log_target_selection(target, "Random")
        return target


# Target selection heuristics-------------
class HighestHealth(TargetSelectionHeuristic):
    def __init__(self):
        super().__init__()

    def select(self, targets):
        target = max(targets, key=lambda t: t.hp)
        self.log_target_selection(target, "Highest health")
        return target


class LowestHealth(TargetSelectionHeuristic):
    def __init__(self):
        super().__init__()

    def select(self, targets):
        target = min(targets, key=lambda t: t.hp)
        self.log_target_selection(target, "Lowest health")
        return target


class HighestAC(TargetSelectionHeuristic):
    def __init__(self):
        super().__init__()

    def select(self, targets):
        target = max(targets, key=lambda t: t.ac)
        self.log_target_selection(target, "Highest ac")
        return target


class LowestAC(TargetSelectionHeuristic):
    def __init__(self):
        super().__init__()

    def select(self, targets):
        target = min(targets, key=lambda t: t.ac)
        self.log_target_selection(target, "Lowest ac")
        return target


class LowestHealthPercentage(TargetSelectionHeuristic):
    def __init__(self):
        super().__init__()

    def select(self, targets):
        target = min(targets, key=lambda t: 1.0 * t.hp / t.max_hp)
        self.log_target_selection(target, "Lowest health percentage")
        return target


# Should heal heuristics------------------
class LowestHealthPercentageBelowThreshold(TargetSelectionHeuristic):
    def __init__(self, threshold=0.4):
        super().__init__()
        self.threshold = threshold

    def select(self, targets):
        target = None
        eligible_targets = [t for t in targets if t.hp <= t.max_hp * self.threshold]
        if len(eligible_targets) > 0:
            target = min(eligible_targets, key=lambda t: 1.0 * t.hp / t.max_hp)
            self.log_target_selection(target,
                                      "Lowest health percentage below "
                                      "threshold {0}".format(self.threshold))
        return target


