from math import floor, ceil

from django.db import models, transaction
from simulation.heuristics.heuristic_container import HeuristicContainer

from actions.models import Action, SingleAttack, ComboAttack
from actions.aoe_choices import AOE_PERCENT_HIT_MAP
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
    num_legendary_actions = models.SmallIntegerField(default=0)
    combatant_type = models.CharField(max_length=128, null=True)
    size = models.CharField(max_length=32, null=True)
    speed = models.PositiveSmallIntegerField(null=True)

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

    @staticmethod
    @transaction.atomic
    def create(**kwargs):
        """ Create a combatant; handles error checking on the attributes

        Keyword Args:
             name (str): name of combatant
             hp (int): the amount of max hp of the combatant
             ac (int): the armor class of combatant, must be >= 1
             proficiency (int): the proficiency bonus. Must be <= 10
             str_save (int)
             dex_save (int)
             con_save (int)
             wis_save (int)
             int_save (int)
             cha_save (int)
             cr (int): the creature rating of the creature
             actions (list): a list of action names that the creature can take

        Returns:
            msg (str): "Success" if the combatant was created otherwise the
                error that caused failure
        """
        save_range = set(range(1, 31, 1))
        if not kwargs['name']:
            return "Combatant needs a name"
        elif Combatant.objects.filter(name=kwargs['name']).exists():
            return "Combatant needs a unique name"
        elif int(kwargs['hp']) < 1:
            return "Combatant HP must be greater than 1"
        elif int(kwargs['ac']) < 1:
            return "Combatant AC must be greater than 1"
        elif int(kwargs['proficiency']) < 1:
            return "Combatant proficiency must be greater than 1"
        elif {int(kwargs['strength']), int(kwargs['dexterity']),
              int(kwargs['constitution']), int(kwargs['wisdom']),
              int(kwargs['intelligence']), int(kwargs['charisma'])}.difference(
            save_range):
            return "All combatant stats must be between 1 and 30"
        elif 'cr' in kwargs and int(kwargs['cr']) > 30 or int(kwargs['cr']) < 0:
            return "Combatant challenge rating must be between 0 and 30"
        elif not kwargs['actions'].split(","):
            return "Combatant must have at least 1 action to take"
        c = Combatant(
            name=kwargs['name'],
            max_hp=int(kwargs['hp']),
            ac=int(kwargs['ac']),
            proficiency=int(kwargs['proficiency']),
            str_save=floor((int(kwargs['strength']) - 10) / 2),
            dex_save=floor((int(kwargs['dexterity']) - 10) / 2),
            con_save=floor((int(kwargs['constitution']) - 10) / 2),
            wis_save=floor((int(kwargs['wisdom']) - 10) / 2),
            int_save=floor((int(kwargs['intelligence']) - 10) / 2),
            cha_save=floor((int(kwargs['charisma']) - 10) / 2),
            cr=int(kwargs['cr']) if 'cr' in kwargs else 1
        )
        c.save()
        cas = []
        for action_name in kwargs['actions'].split(','):
            try:
                action = Action.objects.get(name=action_name)
            except Action.DoesNotExist:
                return "Could not find action with name {}".format(action_name)
            cas.append(CombatantAction(combatant=c, action=action))
        CombatantAction.objects.bulk_create(cas)
        return "Success"

    @staticmethod
    def load_combatant(name, name_suffix="", should_ready=False, num_enemies=1):
        try:
            combatant = Combatant.objects.get(name=name)
        except Combatant.DoesNotExist:
            raise RuntimeError("Combatant with name {} does not exist".format(
                name))

        if should_ready:
            combatant.ready_for_battle(num_enemies=num_enemies)

        if name_suffix:
            combatant.name += "_" + name_suffix

        return combatant

    def ready_for_battle(self, heuristics=HeuristicContainer(),
                         applied_effects=[], num_enemies=1):
        self.hp = self.max_hp
        self.saves = self._convert_saves_to_dict()
        self.attacks = sorted([
            a.instantiate() for a in self.actions.all()
            if a.action_type == "Attack" and not a.is_legendary],
            key=lambda x: x.calc_expected_damage(num_enemies), reverse=True)
        self.heals = sorted([
            a.instantiate() for a in self.actions.all()
            if a.action_type == "Heal"],
            key=lambda x: x.calc_expected_heal(), reverse=True)
        self.legendary_actions = sorted([
            a.instantiate() for a in self.actions.all()
            if a.action_type == "Attack" and a.is_legendary],
            key=lambda x: x.calc_expected_damage(num_enemies),
            reverse=True)
        self.legendary_actions_left = self.num_legendary_actions
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
        self.legendary_actions_left = self.num_legendary_actions

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
            did_heal = self._try_heal(allies, heuristic)
            if not did_heal:
                self._try_attack(enemies, heuristic)
        self.on_turn_end()

    def try_legendary_action(self, enemies, heuristic):
        possible_actions = [a for a in self.legendary_actions
                            if a.legendary_action_cost <= self.legendary_actions_left]
        if not possible_actions:
            return
        # The actions should be ordered by most damage, so select the first one
        self._try_attack(enemies, heuristic, attack=possible_actions[0])
        self.legendary_actions_left -= possible_actions[0].legendary_action_cost

    def make_attack(self, targets, attack_heuristic, attack_to_use):
        target = self._choose_target(targets, attack_heuristic)
        targets_left = targets
        if attack_to_use.is_aoe:
            targets_left = [e for e in targets if e != target]
        attack_to_use.do_damage(self, target)
        attack_to_use.apply_effects(target)
        return [e for e in targets_left if e.hp > 0]

    def _try_attack(self, enemies, heuristic, attack=None):
        if attack is None:
            attack = Combatant.choose_action(self.attacks)

        if not enemies:
            return

        if isinstance(attack, SingleAttack):
            num_targets_hit = AOE_PERCENT_HIT_MAP[attack.aoe_type](
                len(enemies)) if attack.aoe_type else 1
            for _ in range(num_targets_hit):
                if not enemies:
                    break
                enemies = self.make_attack(
                    enemies, heuristic.attack_selection, attack)
        elif isinstance(attack, ComboAttack):
            for single_attack in attack.instantiated_attacks:
                self._try_attack(
                    enemies, heuristic, attack=single_attack)
        attack.ready = False

    def _try_heal(self, allies, heuristic):
        heal_target = self._check_heal_need(allies, heuristic.heal_selection)
        available_heals = [h for h in self.heals if h.num_available > 0]
        healed = False
        if len(available_heals) > 0 and heal_target:
            heal = Combatant.choose_action(self.heals)
            for _ in range(heal.num_targets):
                if heal_target is not None:
                    heal.do_heal(self, heal_target)
                    allies = [a for a in allies if a != heal_target]
                    heal_target = self._check_heal_need(
                        allies, heuristic.heal_selection)
                    healed = True
        return healed

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
            "label": self.name,  # This is for the frontend
            "value": self.name,  # This is for the frontend
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
