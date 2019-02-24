/**
 * Created by Andrew on 1/16/18.
 */

import { SET_TEAM1_COMBATANTS, SET_TEAM2_COMBATANTS, INCREMENT_COUNTER } from './actions/actions'

const initialState = {
  team1Combatants: [],
  team2Combatants: [],
  allCombatants: [
    {value: 'goblin', label: 'Goblin'},
    {value: 'orc', label: 'Orc'}
  ],
  counter: 0,
};

function combatantHandler(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case SET_TEAM1_COMBATANTS:
      return Object.assign({}, state, {
        team1Combatants: state.team1Combatants.concat(action.combatant)
      });
    case SET_TEAM2_COMBATANTS:
      return Object.assign({}, state, {
        team2Combatants: state.team2Combatants.concat(action.combatant)
      });
    case INCREMENT_COUNTER:
      return Object.assign({}, state, {
        counter: state.counter + 1
      });
    default:
      return state
  }
}

export {combatantHandler as default}