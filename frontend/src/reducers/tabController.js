import { combineReducers } from 'redux'
import * as t from '../actions/tabControllerActions'
import {setterReducer} from '../common'


const currentTab = setterReducer("Simulator", t.SET_CURRENT_TAB);


const reducer = combineReducers({
  currentTab,
})

export {reducer as default}