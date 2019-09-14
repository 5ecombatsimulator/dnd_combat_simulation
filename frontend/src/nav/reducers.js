import { combineReducers } from 'redux'
import * as t from './actions'
import {setterReducer} from '../common/utils'


const currentTab = setterReducer("Simulator", t.SET_CURRENT_TAB);


const reducer = combineReducers({
  currentTab,
})

export {reducer as default}