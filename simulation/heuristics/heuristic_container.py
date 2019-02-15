class HeuristicContainer:
    attack_selection = None
    heal_selection = None

    def __init__(self, attack_selection=None, heal_selection=None):
        self.attack_selection = attack_selection
        self.heal_selection = heal_selection

