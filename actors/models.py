from django.db import models
from simulation.heuristics.heuristic_container import HeuristicContainer

from actions.models import Action
from effects.models import Effect


class Combatant(models.Model):
    name = models.CharField(max_length=64, unique=True)
    # Maximum value of 32767 on PositiveSmallIntegerField, seems like plenty
    max_hp = models.PositiveSmallIntegerField()
    ac = models.PositiveSmallIntegerField()
    proficiency = models.PositiveSmallIntegerField()
    str_save = models.PositiveSmallIntegerField()
    dex_save = models.PositiveSmallIntegerField()
    con_save = models.PositiveSmallIntegerField()
    wis_save = models.PositiveSmallIntegerField()
    int_save = models.PositiveSmallIntegerField()
    cha_save = models.PositiveSmallIntegerField()
    cr = models.FloatField()

    actions = models.ManyToManyField(Action, through='CombatantAction')
    innate_effects = models.ManyToManyField(Effect, through='CombatantInnateEffect')

    def __str__(self):
        return "{}".format(self.name)

    def __eq__(self, other):
        """
        Redefined such that instantiations of the DB objects are not equal if
        they have the same name. This lets us use changed names as a signal
        that, for example, two "Goblin"s can fight one another
        """
        if "name" not in other.__dict__:
            return False
        return self.name == other.name

    def ready_for_battle(self, heuristics=HeuristicContainer(),
                         applied_effects=[]):
        self.hp = self.max_hp
        self.saves = self._convert_saves_to_dict()
        print(self.actions.all())
        self.attacks = sorted([a.instantiate() for a in self.actions.all()
                               if a.action_type == "Attack"],
                                key=lambda x: x.calc_expected_damage(),
                                reverse=True)
        self.heals = sorted([a.instantiate() for a in self.actions.all()
                             if a.action_type == "Heal"],
                                key=lambda x: x.calc_expected_heal(),
                                reverse=True)
        self.num_actions_available = 1  # All creatures start with 1 available action
        self.heuristics = heuristics
        # TODO: deal with combining many to many field
        self.applied_effects = list(self.innate_effects.all()) + applied_effects

    def _convert_saves_to_dict(self):
        return {
            "STR": self.str_save,
            "DEX": self.dex_save,
            "CON": self.con_save,
            "WIS": self.wis_save,
            "INT": self.int_save,
            "CHA": self.cha_save
        }

    @staticmethod
    def choose_action(action_set):
        for action in action_set:
            if not action.ready:
                action.try_recharge()
            if action.ready and action.num_available != 0:
                action.num_available -= 1
                action.ready = False
                return action

    def on_turn_start(self):
        if self.applied_effects is not None and len(self.applied_effects) > 0:
            for effect in self.applied_effects:
                effect.on_turn_start(self)

    def on_turn_end(self):
        if self.applied_effects is not None and len(self.applied_effects) > 0:
            for effect in self.applied_effects:
                still_active = effect.on_turn_end(self)
                if not still_active:
                    self.applied_effects.remove(effect)
        self.num_actions_available = 1

    def take_turn(self, allies, enemies, heuristic):
        self.on_turn_start()
        if self.hp < 0:
            return
        while self.num_actions_available > 0:
            self.num_actions_available -= 1
            self._try_heal(allies, heuristic)
            self._try_attack(enemies, heuristic)
        self.on_turn_end()

    def _try_attack(self, enemies, heuristic):
        attack = self.choose_action(self.attacks)
        for _ in range(attack.multi_attack):
            if enemies:
                target = self._choose_target(enemies,
                                             heuristic.attack_selection)
                if attack.is_aoe:
                    enemies = [e for e in enemies if e != target]
                attack.do_damage(self, target)
                attack.apply_effects(target)

    def _try_heal(self, allies, heuristic):
        heal_target = self._check_heal_need(allies, heuristic.heal_selection)
        available_heals = [h for h in self.heals if h.num_available > 0]
        if len(available_heals) > 0 and heal_target:
            heal = self.choose_action(self.heals)
            for _ in range(heal.num_targets):
                if heal_target is not None:
                    heal.do_heal(self, heal_target)
                    allies = [a for a in allies if a != heal_target]
                    heal_target = self._check_heal_need(
                        allies, heuristic.heal_selection)

    def _choose_target(self, enemies, heuristic):
        if self.heuristics.attack_selection:
            return self.heuristics.attack_selection.select(enemies)
        return heuristic.select(enemies)

    def _check_heal_need(self, allies, should_heal_heuristic):
        if self.heuristics.heal_selection:
            return self.heuristics.heal_selection.select(allies)
        return should_heal_heuristic.select(allies)

    def take_damage(self, damage, attack_type):
        """ Takes the given damage while checking for modifications to it """
        for e in self.applied_effects:
            if e.effect_type == "Type Resistance" and e.name == attack_type:
                damage *= 0.5
            if e.effect_type == "Type Vulnerability" and e.name == attack_type:
                damage *= 1.5
            if e.effect_type == "Type Immunity" and e.name == attack_type:
                damage = 0
        self.hp -= damage

    def jsonify(self):
        """ Turn a creature object into JSON """
        combatant_info = {
            "name": self.name,
            "hp": self.max_hp,
            "ac": self.ac,
            "proficiency": self.proficiency,
            "saves": self._convert_saves_to_dict(),
            "actions": [a.name for a in self.actions.all()],
            "innate_effects": [e.name for e in self.innate_effects.all()],
            "cr": self.cr
        }
        return combatant_info


class CombatantAction(models.Model):
    combatant = models.ForeignKey(Combatant, on_delete=models.CASCADE)
    action = models.ForeignKey(Action, on_delete=models.CASCADE)


class CombatantInnateEffect(models.Model):
    combatant = models.ForeignKey(Combatant, on_delete=models.CASCADE)
    effect = models.ForeignKey(Effect, on_delete=models.CASCADE)