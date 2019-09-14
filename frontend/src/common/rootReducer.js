import { combineReducers } from 'redux'
import combatantSelectionReducer from '../simulation/reducers'
import combatantCreationReducer from '../combatantCreation/reducers'
import actionCreationReducer from '../actionCreation/reducers'
import effectCreationReducer from '../effectCreation/reducers'
import exploreCombatantReducer from '../exploreCombatants/reducers'

const reducer = combineReducers({
  combatantSelectionReducer,
  combatantCreationReducer,
  actionCreationReducer,
  effectCreationReducer,
  exploreCombatantReducer,
});

export {reducer as default}
