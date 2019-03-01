import {setterAction} from '../common'
import SimulatorSource from '../sources/simulatorSource'
import {setAllActions} from "./actions";
import get from "./utils"


/* Action types */

// 'effects',

export const SET_ACTION_NAME = 'SET_ACTION_NAME';
export const SET_STAT_BONUS = 'SET_STAT_BONUS';
export const SET_DAMAGE_TYPE = 'SET_DAMAGE_TYPE';
export const SET_BONUS_TO_HIT = 'SET_BONUS_TO_HIT';
export const SET_BONUS_TO_DAMAGE = 'SET_BONUS_TO_DAMAGE';
export const SET_MULTI_ATTACK = 'SET_MULTI_ATTACK';
export const SET_RECHARGE_PERCENTILE = 'RECHARGE_PERCENTILE';
export const SET_IS_LEGENDARY = 'IS_LEGENDARY';
export const SET_LEGENDARY_ACTION_COST = 'LEGENDARY_ACTION_COST';
export const SET_DICE = "SET_DICE";
export const SET_DAMAGE_TYPE_OPTIONS = "SET_DAMAGE_TYPE_OPTIONS";
export const SET_SAVE_STAT = "SET_SAVE_STAT";
export const SET_SAVE_DC = "SET_SAVE_DC";
export const SET_IS_AOE = "SET_IS_AOE";
export const SET_AOE_TYPE = "SET_AOE_TYPE";
export const SET_AOE_TYPE_OPTIONS = "SET_AOE_TYPE_OPTIONS";
export const SET_SPELL_OR_ATTACK = "SET_SPELL_OR_ATTACK";
export const SET_DOES_HALF_DAMAGE_ON_FAILURE = "SET_DOES_HALF_DAMAGE_ON_FAILURE";
export const SET_ACTION_CREATION_ERROR_MSG = "SET_ACTION_CREATION_ERROR_MSG";


/* Setter actions */
export const setActionName = setterAction(SET_ACTION_NAME);
export const setStatBonus = setterAction(SET_STAT_BONUS);
export const setDamageType = setterAction(SET_DAMAGE_TYPE);
export const setBonusToHit = setterAction(SET_BONUS_TO_HIT);
export const setBonusToDamage = setterAction(SET_BONUS_TO_DAMAGE);
export const setMultiAttack = setterAction(SET_MULTI_ATTACK);
export const setRechargePercentile = setterAction(SET_RECHARGE_PERCENTILE);
export const setLegendaryActionCost = setterAction(SET_LEGENDARY_ACTION_COST);
export const setDice = setterAction(SET_DICE);
export const setIsLegendary = setterAction(SET_IS_LEGENDARY);
export const setSaveStat = setterAction(SET_SAVE_STAT);
export const setSaveDC = setterAction(SET_SAVE_DC);
export const setIsAoe = setterAction(SET_IS_AOE);
export const setAoeType = setterAction(SET_AOE_TYPE);
export const setActionCreationErrorMsg = setterAction(SET_ACTION_CREATION_ERROR_MSG);

export const setSpellOrAttack = setterAction(SET_SPELL_OR_ATTACK);
export const setDoesHalfDamageOnFailure = setterAction(SET_DOES_HALF_DAMAGE_ON_FAILURE);

export const setDamageTypeOptions = setterAction(SET_DAMAGE_TYPE_OPTIONS);
export const setAoeTypeOptions = setterAction(SET_AOE_TYPE_OPTIONS);

export const getDamageTypeOptions = get(SimulatorSource.getDamageTypes, setDamageTypeOptions);
export const getAoeTypeOptions = get(SimulatorSource.getAoeTypes, setAoeTypeOptions);

export const shiftIsLegendary = () => (dispatch, getState) => {
  let {actionCreationReducer} = getState();
  let {isLegendary} = actionCreationReducer;
  if (isLegendary) {
    dispatch(setIsLegendary(false))
  }
  else {
    dispatch(setIsLegendary(true))
  }
};

export const shiftDoesHalfDamageOnFailure = () => (dispatch, getState) => {
  let {actionCreationReducer} = getState();
  let {halfDamage} = actionCreationReducer;
  if (halfDamage) {
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
    dispatch(setIsAoe(false))
  }
  else {
    dispatch(setIsAoe(true))
  }
};

export const resetActionCreationErrorMsg = () => (dispatch, getState) => {
  dispatch(setActionCreationErrorMsg(""));
};

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
