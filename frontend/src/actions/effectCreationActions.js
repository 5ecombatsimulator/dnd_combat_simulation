import {setterAction} from '../common'
import get from './utils'

/* Action types */
export const SET_EFFECT_NAME = 'SET_EFFECT_NAME';
export const SET_EFFECT_TYPE = 'SET_EFFECT_TYPE';


/* Actions */
export const setEffectName = setterAction(SET_EFFECT_NAME);
export const setEffectType = setterAction(SET_EFFECT_TYPE);
