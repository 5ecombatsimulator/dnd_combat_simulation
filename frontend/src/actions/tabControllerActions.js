import {setterAction} from '../common'
import get from './utils'
import SimulatorSource from '../sources/simulatorSource'

export const SET_CURRENT_TAB = "SET_CURRENT_TAB";

/* Setter actions */
export const setCurrentTab = setterAction(SET_CURRENT_TAB);