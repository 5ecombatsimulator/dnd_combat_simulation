import { combineReducers } from 'redux'
import * as t from './actionTypes'
import {setterReducer} from '../common/utils'

const getItemValue = (item, index) => {
  let i = item.value.indexOf('_')
  return (i === -1 ? item.value : item.value.slice(0, i)) + '_' + index
}

const teamReducer = (setAction, addAction) => (state=[], action) => {
  let newState = []
  switch(action.type) {
    case setAction:
      newState = action.payload
      break
    case addAction:
      newState = [...state, action.payload]
      break
    default:
      return state
  }
  return newState.map((item, index) => ({...item, value: getItemValue(item, index)}))
}

const team1Combatants = teamReducer(t.SET_TEAM1_COMBATANTS, t.ADD_TEAM1_COMBATANT);
const team2Combatants = teamReducer(t.SET_TEAM2_COMBATANTS, t.ADD_TEAM2_COMBATANT);
const allCombatants = setterReducer([], t.SET_ALL_COMBATANTS);
const battleKey = setterReducer("", t.SET_BATTLE_KEY);
const battleKeyMessage = setterReducer("", t.SET_BATTLE_KEY_MESSAGE);
const battleLoadMessage = setterReducer("", t.SET_LOAD_BATTLE_MESSAGE);

const simulationResults = setterReducer(
  {"avg_num_rounds": "-",
   "avg_t1_deaths": "-",
   "num_times_at_least_one_t1_death": "-",
   "perc_time_t1_won": "-",
   "avg_num_round_when_t1_won": "-",
   "avg_num_round_when_t2_won": "-"
  },
t.SET_SIMULATION_RESULTS);

const reducer = combineReducers({
  allCombatants,
  team1Combatants,
  team2Combatants,
  simulationResults,
  battleKey,
  battleKeyMessage,
  battleLoadMessage,
});

export {reducer as default}