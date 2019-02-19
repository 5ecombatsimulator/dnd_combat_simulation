from copy import deepcopy

from utils.dice import d20
from debug.logger import Logger


class Simulator:
    logger = Logger()

    def __init__(self, pcs, enemies):
        """
        :param pcs: A list of creatures that represent the PCs
        :param enemies: A list of creatures that represent the enemies in the battle
        """
        self.pcs = deepcopy(pcs)
        self.enemies = deepcopy(enemies)
        self.legendary_action_users = [
            combatant for combatant in self.pcs + self.enemies if combatant.legendary_actions]
        self.battle_order = None

        for pc in self.pcs:
            pc.enemies = self.enemies
            pc.allies = [x for x in self.pcs if x is not pc]
        for enemy in self.enemies:
            enemy.enemies = self.pcs
            enemy.allies = [x for x in self.enemies if x is not enemy]

    def log_deaths(self, dead, alignment):
        self.logger.log_death("{0} dead: {1}".format(alignment, ", ".join(dead)))

    def log_enemy_deaths(self, dead):
        if len(dead) == 1:
            self.logger.log_death("Enemy dead: {0}".format(dead[0]))
        else:
            self.log_deaths(dead, "Enemies")

    def log_player_deaths(self, dead):
        if len(dead) == 1:
            self.logger.log_death("Player dead: {0}".format(dead[0]))
        else:
            self.log_deaths(dead, "Players")

    def calc_initiative(self):
        pc_initiative = [(pc, d20() + pc.saves['DEX']) for pc in self.pcs]
        enemies_initiative = [(enemy, d20() + enemy.saves['DEX']) for enemy in self.enemies]
        self.battle_order = [(t[0], 0 if t[0] in self.pcs else 1) for t in
                             sorted(pc_initiative + enemies_initiative, key=lambda x: x[1],
                                    reverse=True)]

    def run_round(self, heuristic):
        for creature, team in self.battle_order:
            if creature.hp <= 0:
                continue
            allies = [x[0] for x in self.battle_order if x[1] == team and x[0].hp > 0]
            enemies = [x[0] for x in self.battle_order if x[1] != team and x[0].hp > 0]
            if not enemies:
                break
            creature.take_turn(allies, enemies, heuristic)
            for legendary_action_user in self.legendary_action_users:
                legendary_action_user.try_legendary_action(
                    legendary_action_user.enemies, heuristic)

        dead_enemies = [c.name for c in self.enemies if c.hp <= 0]
        dead_pcs = [c.name for c in self.pcs if c.hp <= 0]

        self.battle_order = [c for c in self.battle_order if c[0].hp > 0]
        self.enemies = [c for c in self.enemies if c.hp > 0]
        self.pcs = [c for c in self.pcs if c.hp > 0]

        return dead_enemies, dead_pcs

    def run_battle(self, heuristic):
        num_player_deaths = 0
        round_num = 0
        self.calc_initiative()
        while self.enemies and self.pcs:
            self.logger.log_info("---- Round {0} ----".format(round_num))
            enemies_dead, players_dead = self.run_round(heuristic)
            if players_dead:
                num_player_deaths += len(players_dead)

            if enemies_dead:
                self.log_enemy_deaths(enemies_dead)
            if players_dead:
                self.log_player_deaths(players_dead)

            round_num += 1
        winning_team = 0 if self.pcs else 1
        return round_num, num_player_deaths, winning_team

