import { combineReducers } from 'redux'
import * as t from '../actions/actionCreationActions'
import {setterReducer} from '../common'

const actionName = setterReducer("", t.SET_ACTION_NAME);
const statBonus = setterReducer("", t.SET_STAT_BONUS);
const damageType = setterReducer("", t.SET_DAMAGE_TYPE);
const bonusToHit = setterReducer(0, t.SET_BONUS_TO_HIT);
const bonusToDamage = setterReducer(0, t.SET_BONUS_TO_DAMAGE);
const multiAttack = setterReducer(1, t.SET_MULTI_ATTACK);
const rechargePercentile = setterReducer(0, t.SET_RECHARGE_PERCENTILE);
const isLegendary = setterReducer(false, t.SET_IS_LEGENDARY);
const legendaryActionCost = setterReducer(0, t.SET_LEGENDARY_ACTION_COST);
const dice = setterReducer("", t.SET_DICE);
const damageTypeOptions = setterReducer([], t.SET_DAMAGE_TYPE_OPTIONS);

const reducer = combineReducers({
  actionName,
  statBonus,
  damageType,
  bonusToHit,
  bonusToDamage,
  multiAttack,
  rechargePercentile,
  isLegendary,
  legendaryActionCost,
  dice,
  damageTypeOptions,
});

export {reducer as default}