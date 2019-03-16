import { combineReducers } from 'redux'
import * as t from '../actions/effectCreationActions'
import {setterReducer} from '../common'

const effectName = setterReducer("", t.SET_EFFECT_NAME);
const effectType = setterReducer("", t.SET_EFFECT_TYPE);

const reducer = combineReducers({
  effectName,
  effectType,
})

export {reducer as default}