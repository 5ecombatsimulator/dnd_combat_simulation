import { combineReducers } from 'redux'
import combatantSelectionReducer from '../simulation/reducers'
import combatantCreationReducer from '../combatant/reducers'
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
