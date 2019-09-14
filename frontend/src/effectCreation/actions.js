import {setterAction} from '../common/utils'
import SimulatorSource from '../common/sources/simulatorSource'
import * as t from './actionTypes'

/* Actions */
export const setEffectName = setterAction(t.SET_EFFECT_NAME);
export const setEffectType = setterAction(t.SET_EFFECT_TYPE);
export const setEffectDamageDice = setterAction(t.SET_EFFECT_DAMAGE_DICE);
export const setEffectSaveDC = setterAction(t.SET_EFFECT_SAVE_DC);
export const setEffectSaveStat = setterAction(t.SET_EFFECT_SAVE_STAT);
export const setEffectNumTurns = setterAction(t.SET_EFFECT_NUM_TURNS);
export const setAllEffectTypes = setterAction(t.SET_ALL_EFFECT_TYPES);

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