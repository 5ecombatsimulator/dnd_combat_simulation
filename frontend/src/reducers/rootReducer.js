import { combineReducers } from 'redux'
import combatantSelectionReducer from './combatantSelection'
import combatantCreationReducer from './combatantCreation'
import actionCreationReducer from './actionCreation'

const reducer = combineReducers({
  combatantSelectionReducer,
  combatantCreationReducer,
  actionCreationReducer
});

export {reducer as default}
