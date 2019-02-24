import {setterAction} from '../common'
import SimulatorSource from '../sources/simulatorSource'
import {setAllActions, setSimulationResults} from "./actions";
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
export const setDamageTypeOptions = setterAction(SET_DAMAGE_TYPE_OPTIONS);

export const getDamageTypeOptions = get(SimulatorSource.getDamageTypes, setDamageTypeOptions);

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

export const createAction = (actionType) => (dispatch, getState) => {
  let {actionCreationReducer} = getState();
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
    actionCreationReducer.dice).then(({data}) => {
      dispatch(setAllActions(data.actions))
  })
}
