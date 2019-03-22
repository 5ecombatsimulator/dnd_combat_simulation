import { combineReducers } from 'redux'
import combatantSelectionReducer from './combatantSelection'
import combatantCreationReducer from './combatantCreation'
import actionCreationReducer from './actionCreation'
import effectCreationReducer from './effectCreation'
import exploreCombatantReducer from './exploreCombatant'

const reducer = combineReducers({
  combatantSelectionReducer,
  combatantCreationReducer,
  actionCreationReducer,
  effectCreationReducer,
  exploreCombatantReducer,
});

export {reducer as default}
