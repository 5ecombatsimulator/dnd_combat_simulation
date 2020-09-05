import { combineReducers } from 'redux'
import * as t from './actionTypes'
import {setterReducer} from '../common/utils'

const effectName = setterReducer("", t.SET_EFFECT_NAME);
const effectType = setterReducer("", t.SET_EFFECT_TYPE);
const damageDice = setterReducer("", t.SET_EFFECT_DAMAGE_DICE);
const saveDC = setterReducer(8, t.SET_EFFECT_SAVE_DC);
const saveStat = setterReducer(8, t.SET_EFFECT_SAVE_STAT);
const numTurns = setterReducer(3, t.SET_EFFECT_NUM_TURNS);
const effectCreationMessage = setterReducer("", t.SET_EFFECT_CREATION_MESSAGE);

const allEffectTypes = setterReducer([], t.SET_ALL_EFFECT_TYPES);

const reducer = combineReducers({
  effectName,
  effectType,
  damageDice,
  saveDC,
  saveStat,
  numTurns,
  allEffectTypes,
  effectCreationMessage,
})

export {reducer as default}