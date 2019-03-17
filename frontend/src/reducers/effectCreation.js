import { combineReducers } from 'redux'
import * as t from '../actions/effectCreationActions'
import {setterReducer} from '../common'

const effectName = setterReducer("", t.SET_EFFECT_NAME);
const effectType = setterReducer("", t.SET_EFFECT_TYPE);
const damageDice = setterReducer("", t.SET_EFFECT_DAMAGE_DICE);
const saveDC = setterReducer(8, t.SET_EFFECT_SAVE_DC);
const saveStat = setterReducer(8, t.SET_EFFECT_SAVE_STAT);

const reducer = combineReducers({
  effectName,
  effectType,
  damageDice,
  saveDC,
  saveStat
})

export {reducer as default}