import { combineReducers } from 'redux'
import combatantSelectionReducer from './combatantSelection'
import combatantCreationReducer from './combatantCreation'

const reducer = combineReducers({
  combatantSelectionReducer,
  combatantCreationReducer
})

export {reducer as default}
