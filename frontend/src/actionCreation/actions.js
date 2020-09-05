import {simpleAction} from '../common/utils'
import SimulatorSource from '../common/sources/simulatorSource'
import {setAllActions} from "../simulation/actions";
import get from "../common/actionUtils"
import * as t from './actionTypes'

/* Setter actions */
export const setActionName = simpleAction(t.SET_ACTION_NAME);
export const setStatBonus = simpleAction(t.SET_STAT_BONUS);
export const setDamageType = simpleAction(t.SET_DAMAGE_TYPE);
export const setBonusToHit = simpleAction(t.SET_BONUS_TO_HIT);
export const setBonusToDamage = simpleAction(t.SET_BONUS_TO_DAMAGE);
export const setMultiAttack = simpleAction(t.SET_MULTI_ATTACK);
export const setRechargePercentile = simpleAction(t.SET_RECHARGE_PERCENTILE);
export const setLegendaryActionCost = simpleAction(t.SET_LEGENDARY_ACTION_COST);
export const setDice = simpleAction(t.SET_DICE);
export const setIsLegendary = simpleAction(t.SET_IS_LEGENDARY);
export const setSaveStat = simpleAction(t.SET_SAVE_STAT);
export const setSaveDC = simpleAction(t.SET_SAVE_DC);
export const setIsAoe = simpleAction(t.SET_IS_AOE);
export const setAoeType = simpleAction(t.SET_AOE_TYPE);
export const setActionCreationErrorMsg = simpleAction(t.SET_ACTION_CREATION_ERROR_MSG);
export const setAllEffects = simpleAction(t.SET_ALL_EFFECTS);
export const setActionEffects = simpleAction(t.SET_ACTION_EFFECTS);
export const setEffectsGotten = simpleAction(t.SET_EFFECTS_GOTTEN);

export const setSpellOrAttack = simpleAction(t.SET_SPELL_OR_ATTACK);
export const setDoesHalfDamageOnFailure = simpleAction(t.SET_DOES_HALF_DAMAGE_ON_FAILURE);

export const setDamageTypeOptions = simpleAction(t.SET_DAMAGE_TYPE_OPTIONS);
export const setAoeTypeOptions = simpleAction(t.SET_AOE_TYPE_OPTIONS);

export const getDamageTypeOptions = get(SimulatorSource.getDamageTypes, setDamageTypeOptions);
export const getAoeTypeOptions = get(SimulatorSource.getAoeTypes, setAoeTypeOptions);

export const shiftIsLegendary = () => (dispatch, getState) => {
  let {actionCreationReducer} = getState();
  let {isLegendary} = actionCreationReducer;
  if (isLegendary) {
    dispatch(setLegendaryActionCost(0));
    dispatch(setIsLegendary(false))
  }
  else {
    dispatch(setIsLegendary(true))
  }
};

export const shiftDoesHalfDamageOnFailure = () => (dispatch, getState) => {
  let {actionCreationReducer} = getState();
  let {doesHalfDamageOnFailure} = actionCreationReducer;
  if (doesHalfDamageOnFailure) {
    dispatch(setDoesHalfDamageOnFailure(false));
  }
  else {
    dispatch(setDoesHalfDamageOnFailure(true));
  }
};

export const shiftIsAoe = () => (dispatch, getState) => {
  let {actionCreationReducer} = getState();
  let {isAoe} = actionCreationReducer;
  if (isAoe) {
    dispatch(setAoeType(""));
    dispatch(setIsAoe(false));
  }
  else {
    dispatch(setIsAoe(true))
  }
};

export const resetActionCreationErrorMsg = () => (dispatch, getState) => {
  dispatch(setActionCreationErrorMsg(""));
};

export const addActionEffect = (newEffect) => (dispatch, getState) => {
  /*
   * Kind of a hacky way to insert into the list... thought the list should
   * never be all that long so seems okay. Maybe revisit if this call ends up
   * taking a lot of time.
   */
  let {actionCreationReducer} = getState();
  let {actionEffects} = actionCreationReducer;
  for (let key in actionEffects) {
    if (actionEffects[key].value === newEffect.value) {
      return
    }
  }
  dispatch(setActionEffects(actionEffects.concat(newEffect)));
}

export const updateActionEffects = (newState) => (dispatch, getState) => {
  dispatch(setActionEffects(newState));
}

export const resetTabAttributes = () => (dispatch, getState) => {
  let {actionCreationReducer} = getState();
  let ar = actionCreationReducer;
  ar.actionName = "";
  ar.statBonus = "";
  ar.damageType = "";
  ar.bonusToHit = 0;
  ar.bonusToDamage = 0;
  ar.multiAttack = 1;
  ar.rechargePercentile = 0.0;
  ar.isLegendary = false;
  ar.legendaryActionCost = 0;
  ar.dice = "";
  ar.isAoe = false;
  ar.aoeType = "";
  ar.saveStat = "";
  ar.saveDC = 8;
  ar.spellOrAttack = "Attack";
  ar.actionCreationErrorMsg = "";
  ar.doesHalfDamageOnFailure = false;
};

export const getAllEffects = get(SimulatorSource.getEffects, setAllEffects);

export const createAction = (actionType) => (dispatch, getState) => {
  let {actionCreationReducer} = getState();

  if (actionType === "AttackAgainstAC" && actionCreationReducer.spellOrAttack === "Attack") {
    actionType = "PhysicalSingleAttack";
  }
  else if (actionType === "AttackAgainstAC" && actionCreationReducer.spellOrAttack === "Attack") {
    actionType = "SpellSingleAttack";
  }
  else if (actionType === "AttackWithSave" && actionCreationReducer.doesHalfDamageOnFailure) {
    actionType = "SpellSave";
  }
  else if (actionType === "AttackWithSave" && actionCreationReducer.doesHalfDamageOnFailure) {
    actionType = "SpellSingleAttack";
  }

  SimulatorSource.createAction(
    actionCreationReducer.actionName,
    actionType,
    actionCreationReducer.statBonus.value,
    actionCreationReducer.damageType.value,
    actionCreationReducer.bonusToHit,
    actionCreationReducer.bonusToDamage,
    actionCreationReducer.multiAttack,
    actionCreationReducer.rechargePercentile,
    actionCreationReducer.isLegendary,
    actionCreationReducer.legendaryActionCost,
    actionCreationReducer.saveStat,
    actionCreationReducer.saveDC,
    actionCreationReducer.isAoe,
    actionCreationReducer.aoeType.value,
    actionCreationReducer.dice).then(({data}) => {
      dispatch(setAllActions(data.actions));
      dispatch(setActionCreationErrorMsg(data.msg));
  })
}
