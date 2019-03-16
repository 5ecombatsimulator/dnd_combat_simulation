import { combineReducers } from 'redux'
import combatantSelectionReducer from './combatantSelection'
import combatantCreationReducer from './combatantCreation'
import actionCreationReducer from './actionCreation'
import effectCreationReducer from './effectCreation'

const reducer = combineReducers({
  combatantSelectionReducer,
  combatantCreationReducer,
  actionCreationReducer,
  effectCreationReducer
});

export {reducer as default}
