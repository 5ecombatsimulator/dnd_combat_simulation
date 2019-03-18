import {setterAction} from '../common'
import get from './utils'
import SimulatorSource from '../sources/simulatorSource'

/* Action types */
export const SET_EFFECT_NAME = 'SET_EFFECT_NAME';
export const SET_EFFECT_TYPE = 'SET_EFFECT_TYPE';
export const SET_EFFECT_DAMAGE_DICE = "SET_EFFECT_DAMAGE_DICE";
export const SET_EFFECT_SAVE_DC = "SET_EFFECT_SAVE_DC";
export const SET_EFFECT_SAVE_STAT = "SET_EFFECT_SAVE_STAT";
export const SET_EFFECT_NUM_TURNS = "SET_EFFECT_NUM_TURNS";
export const SET_ALL_EFFECT_TYPES = "SET_ALL_EFFECT_TYPES";

/* Actions */
export const setEffectName = setterAction(SET_EFFECT_NAME);
export const setEffectType = setterAction(SET_EFFECT_TYPE);
export const setEffectDamageDice = setterAction(SET_EFFECT_DAMAGE_DICE);
export const setEffectSaveDC = setterAction(SET_EFFECT_SAVE_DC);
export const setEffectSaveStat = setterAction(SET_EFFECT_SAVE_STAT);
export const setEffectNumTurns = setterAction(SET_EFFECT_NUM_TURNS);
export const setAllEffectTypes = setterAction(SET_ALL_EFFECT_TYPES);

export const getAndSetEffectTypes = () => (dispatch, getState) => {
  SimulatorSource.getAllEffectTypes().then(({data}) =>
    dispatch(setAllEffectTypes(data))
  )
}

export const changeEffectType = (e) => (dispatch, getState) => {
  dispatch(setEffectDamageDice(""));
  dispatch(setEffectSaveStat(""));
  dispatch(setEffectSaveDC(8));
  dispatch(setEffectType(e));
}

export const createEffect = () => (dispatch, getState) => {
  let {effectCreationReducer} = getState();
  SimulatorSource.createEffect(
    effectCreationReducer.effectName,
    effectCreationReducer.effectType,
    effectCreationReducer.damageDice,
    effectCreationReducer.saveDC,
    effectCreationReducer.saveStat,
    effectCreationReducer.numTurns,
  )
}