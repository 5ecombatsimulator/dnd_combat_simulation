import { combineReducers } from 'redux'
import combatantSelectionReducer from './combatantSelection'
import combatantCreationReducer from './combatantCreation'
import actionCreationReducer from './actionCreation'
import effectCreationReducer from './effectCreation'
import exploreCombatantReducer from './exploreCombatant'
import tabController from './tabController'

const reducer = combineReducers({
  combatantSelectionReducer,
  combatantCreationReducer,
  actionCreationReducer,
  effectCreationReducer,
  exploreCombatantReducer,
  tabController,
});

export {reducer as default}
