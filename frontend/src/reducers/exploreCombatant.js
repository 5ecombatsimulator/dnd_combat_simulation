import { combineReducers } from 'redux'
import * as t from '../actions/exploreActions'
import {setterReducer} from '../common'


const combatantActions = setterReducer([], t.SET_COMBATANT_ACTIONS);
const combatantName = setterReducer("", t.SET_COMBATANT_NAME);
const combatantHP = setterReducer(null, t.SET_COMBATANT_HP);
const combatantAC = setterReducer(null, t.SET_COMBATANT_AC);
const combatantProficiency = setterReducer(null, t.SET_COMBATANT_PROFICIENCY);
const combatantStrength = setterReducer(null, t.SET_COMBATANT_STRENGTH);
const combatantDexterity = setterReducer(null, t.SET_COMBATANT_DEXTERITY);
const combatantConstitution = setterReducer(null, t.SET_COMBATANT_CONSTITUTION);
const combatantWisdom = setterReducer(null, t.SET_COMBATANT_WISDOM);
const combatantIntelligence = setterReducer(null, t.SET_COMBATANT_INTELLIGENCE);
const combatantCharisma = setterReducer(null, t.SET_COMBATANT_CHARISMA);
const combatantCR = setterReducer(null, t.SET_COMBATANT_CR);
const chosenCombatant = setterReducer("", t.SET_CHOSEN_COMBATANT);


const reducer = combineReducers({
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
  combatantCR,
  chosenCombatant,
})

export {reducer as default}