import { combineReducers } from 'redux'
import * as t from '../actions'
import {setterReducer} from '../common'

const allActions = setterReducer([], t.SET_ALL_ACTIONS);
const combatantActions = setterReducer([], t.SET_COMBATANT_ACTIONS);
const combatantName = setterReducer("", t.SET_COMBATANT_NAME);
const combatantHP = setterReducer(1, t.SET_COMBATANT_HP);
const combatantAC = setterReducer(1, t.SET_COMBATANT_AC);
const combatantProficiency = setterReducer(1, t.SET_COMBATANT_PROFICIENCY);
const combatantStrength = setterReducer(10, t.SET_COMBATANT_STRENGTH);
const combatantDexterity = setterReducer(10, t.SET_COMBATANT_DEXTERITY);
const combatantConstitution = setterReducer(10, t.SET_COMBATANT_CONSTITUTION);
const combatantWisdom = setterReducer(10, t.SET_COMBATANT_WISDOM);
const combatantIntelligence = setterReducer(10, t.SET_COMBATANT_INTELLIGENCE);
const combatantCharisma = setterReducer(10, t.SET_COMBATANT_CHARISMA);
const combatantCreationMsg = setterReducer("", t.SET_COMBATANT_MSG)

const reducer = combineReducers({
  allActions,
  combatantActions,
  combatantName,
  combatantHP,
  combatantAC,
  combatantProficiency,
  combatantStrength,
  combatantDexterity,
  combatantConstitution,
  combatantWisdom,
  combatantIntelligence,
  combatantCharisma,
  combatantCreationMsg
})

export {reducer as default}