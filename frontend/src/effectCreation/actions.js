import {simpleAction} from '../common/utils'
import SimulatorSource from '../common/sources/simulatorSource'
import * as t from './actionTypes'
import * as arActions from "../actionCreation/actions";

/* Actions */
export const setEffectName = simpleAction(t.SET_EFFECT_NAME);
export const setEffectType = simpleAction(t.SET_EFFECT_TYPE);
export const setEffectDamageDice = simpleAction(t.SET_EFFECT_DAMAGE_DICE);
export const setEffectSaveDC = simpleAction(t.SET_EFFECT_SAVE_DC);
export const setEffectSaveStat = simpleAction(t.SET_EFFECT_SAVE_STAT);
export const setEffectNumTurns = simpleAction(t.SET_EFFECT_NUM_TURNS);
export const setAllEffectTypes = simpleAction(t.SET_ALL_EFFECT_TYPES);
export const setEffectCreationMessage = simpleAction(t.SET_EFFECT_CREATION_MESSAGE);

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
    effectCreationReducer.effectType.value,
    effectCreationReducer.damageDice,
    effectCreationReducer.saveDC,
    effectCreationReducer.saveStat.value,
    effectCreationReducer.numTurns,
  ).then(({data}) => {
      dispatch(setEffectCreationMessage(data.msg));
      dispatch(arActions.setEffectsGotten(false))
  })
}