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
const aoeTypeOptions = setterReducer([], t.SET_AOE_TYPE_OPTIONS);

const isAoe = setterReducer(false, t.SET_IS_AOE);
const aoeType = setterReducer("", t.SET_AOE_TYPE);
const saveStat = setterReducer("", t.SET_SAVE_STAT);
const saveDC = setterReducer(8, t.SET_SAVE_DC);

const spellOrAttack = setterReducer("Attack", t.SET_SPELL_OR_ATTACK);
const doesHalfDamageOnFailure = setterReducer(false, t.SET_DOES_HALF_DAMAGE_ON_FAILURE);

const actionCreationErrorMsg = setterReducer("", t.SET_ACTION_CREATION_ERROR_MSG);


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
  isAoe,
  aoeType,
  saveStat,
  saveDC,
  aoeTypeOptions,
  spellOrAttack,
  actionCreationErrorMsg,
  doesHalfDamageOnFailure,
});

export {reducer as default}