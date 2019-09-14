import {setterAction} from '../common/utils'
import SimulatorSource from '../common/sources/simulatorSource'
import * as t from './actionTypes'

/* Action types */
/* Need the E_ prefix because otherwise the action names conflict with
 * the comabtantCreation actions */

export const setCombatantName = setterAction(t.SET_COMBATANT_NAME);
export const setCombatantHP = setterAction(t.SET_COMBATANT_HP);
export const setCombatantAC = setterAction(t.SET_COMBATANT_AC);
export const setCombatantProficiency = setterAction(t.SET_COMBATANT_PROFICIENCY);
export const setCombatantStrength = setterAction(t.SET_COMBATANT_STRENGTH);
export const setCombatantDexterity = setterAction(t.SET_COMBATANT_DEXTERITY);
export const setCombatantConstitution = setterAction(t.SET_COMBATANT_CONSTITUTION);
export const setCombatantWisdom = setterAction(t.SET_COMBATANT_WISDOM);
export const setCombatantIntelligence = setterAction(t.SET_COMBATANT_INTELLIGENCE);
export const setCombatantCharisma = setterAction(t.SET_COMBATANT_CHARISMA);
export const setCombatantActions = setterAction(t.SET_COMBATANT_ACTIONS);
export const setCombatantCR = setterAction(t.SET_COMBATANT_CR);
export const setChosenCombatant = setterAction(t.SET_CHOSEN_COMBATANT);


export const loadCombatant = (combatant) => (dispatch, getState) => {
  dispatch(setChosenCombatant(combatant));

  SimulatorSource.loadCombatant(combatant.value).then(({data}) => {
    let combatantData = data.combatant;
    dispatch(setCombatantName(combatantData.name));
    dispatch(setCombatantHP(combatantData.hp));
    dispatch(setCombatantAC(combatantData.ac));
    dispatch(setCombatantProficiency(combatantData.proficiency));
    dispatch(setCombatantStrength(combatantData.saves.STR));
    dispatch(setCombatantDexterity(combatantData.saves.DEX));
    dispatch(setCombatantConstitution(combatantData.saves.CON));
    dispatch(setCombatantIntelligence(combatantData.saves.INT));
    dispatch(setCombatantWisdom(combatantData.saves.WIS));
    dispatch(setCombatantCharisma(combatantData.saves.CHA));
    dispatch(setCombatantCR(combatantData.cr));
    dispatch(setCombatantActions(combatantData.actions));
  })
}

