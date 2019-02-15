import numpy as np

from simulation.heuristics import target_selection_heuristics, \
    heuristic_container
from simulation.simulator import Simulator

from data_managers.combatant_manager import CombatantManager

heuristic_mapping = dict([(name, cls) for name, cls
                          in target_selection_heuristics.__dict__.items()
                          if isinstance(cls, type)])


class ResultContainer:
    def __init__(self):
        self.num_sims = 0
        self.number_of_rounds = []
        self.number_of_player_deaths = []
        self.winning_teams = []

    def print_results(self):
        result_text = ''
        if self.num_sims > 1:
            result_text += "Average number of rounds: {0}\n".format(np.mean(self.number_of_rounds))
            result_text += "Average number of player deaths: {0}\n".format(np.mean(self.number_of_player_deaths))
            result_text += "Number of times at least 1 player death: {0}\n".format(len([x for x in self.number_of_player_deaths if x > 0]))
            result_text += "Percent of times players won: {0}\n".format(1 - np.mean(self.winning_teams))

        players_won = [self.number_of_rounds[i] for i in range(self.num_sims) if
                       self.winning_teams[i] == 0]
        monsters_won = [self.number_of_rounds[i] for i in range(self.num_sims) if
                        self.winning_teams[i] == 1]
        if players_won:
            result_text += "Average number of rounds when player won: {0}\n".format(np.mean(players_won))
        if monsters_won:
            result_text += "Average number of rounds when monsters won: {0}\n".format(np.mean(monsters_won))
        return result_text

    def to_json(self):
        players_won = [self.number_of_rounds[i] for i in range(self.num_sims) if
                       self.winning_teams[i] == 0]
        monsters_won = [self.number_of_rounds[i] for i in range(self.num_sims)
                        if self.winning_teams[i] == 1]

        avg_num_rounds = np.mean(self.number_of_rounds)
        avg_t1_deaths = np.mean(self.number_of_player_deaths)
        at_least_1_t1_death = len([x for x in self.number_of_player_deaths if x > 0])
        perc_times_t1_won = 1 - np.mean(self.winning_teams)
        avg_num_round_when_t1_won = np.mean(players_won) if players_won else 0
        avg_num_round_when_t2_won = np.mean(monsters_won) if monsters_won else 0

        return {
            "avg_num_rounds": "{0:.2f}".format(avg_num_rounds),
            "avg_t1_deaths": "{0:.2f}".format(avg_t1_deaths),
            "num_times_at_least_one_t1_death": at_least_1_t1_death,
            "perc_time_t1_won": "{0:.2f}".format(perc_times_t1_won),
            "avg_num_round_when_t1_won": "{0:.2f}".format(avg_num_round_when_t1_won),
            "avg_num_round_when_t2_won": "{0:.2f}".format(avg_num_round_when_t2_won)
        }



class BattleRunner:
    def __init__(self):
        self.cm = CombatantManager()
        self.num_sims = 0
        self.res = ResultContainer()

    def run_simulator(self, team1_names, team2_names, num_sims,
                      attack_heuristic='Random', heal_heuristic='LowestHealth'):
        self.num_sims = num_sims
        self.res.num_sims = num_sims
        heuristics = heuristic_container.HeuristicContainer(
            attack_selection=heuristic_mapping[attack_heuristic](),
            heal_selection=heuristic_mapping[heal_heuristic]())

        team1 = [self.cm.load_combatant(name) for name in team1_names]
        team2 = [self.cm.load_combatant(name) for name in team2_names]

        self.res.number_of_rounds = []
        self.res.number_of_player_deaths = []
        self.res.winning_teams = []
        for i in range(self.num_sims):
            sim = Simulator(team1, team2)
            num_rounds, num_player_deaths, winning_team = sim.run_battle(
                heuristics)
            self.res.number_of_player_deaths.append(num_player_deaths)
            self.res.winning_teams.append(winning_team)
            self.res.number_of_rounds.append(num_rounds)

    def get_results(self):
        return self.res

    def print_results(self):
        result_text = ''
        if self.res.num_sims > 1:
            result_text += "Average number of rounds: {0}\n".format(np.mean(self.res.number_of_rounds))
            result_text += "Average number of player deaths: {0}\n".format(np.mean(self.res.number_of_player_deaths))
            result_text += "Number of times at least 1 player death: {0}\n".format(len([x for x in self.res.number_of_player_deaths if x > 0]))
            result_text += "Percent of times players won: {0}\n".format(1 - np.mean(self.res.winning_teams))

        players_won = [self.res.number_of_rounds[i] for i in range(self.num_sims) if
                       self.res.winning_teams[i] == 0]
        monsters_won = [self.res.number_of_rounds[i] for i in range(self.num_sims) if
                        self.res.winning_teams[i] == 1]
        if players_won:
            result_text += "Average number of rounds when player won: {0}\n".format(np.mean(players_won))
        if monsters_won:
            result_text += "Average number of rounds when monsters won: {0}\n".format(np.mean(monsters_won))
        return result_text


if __name__ == "__main__":
    br = BattleRunner()
    br.run_simulator(["Marshall", "Johnny", "Max"],
                     ["Goblin"]*10,
                     200)
