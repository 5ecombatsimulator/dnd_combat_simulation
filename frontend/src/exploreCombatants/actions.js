import {simpleAction} from '../common/utils'
import SimulatorSource from '../common/sources/simulatorSource'
import * as t from './actionTypes'

/* Action types */
/* Need the E_ prefix because otherwise the action names conflict with
 * the comabtantCreation actions */

export const setCombatantName = simpleAction(t.SET_COMBATANT_NAME);
export const setCombatantHP = simpleAction(t.SET_COMBATANT_HP);
export const setCombatantAC = simpleAction(t.SET_COMBATANT_AC);
export const setCombatantProficiency = simpleAction(t.SET_COMBATANT_PROFICIENCY);
export const setCombatantStrength = simpleAction(t.SET_COMBATANT_STRENGTH);
export const setCombatantDexterity = simpleAction(t.SET_COMBATANT_DEXTERITY);
export const setCombatantConstitution = simpleAction(t.SET_COMBATANT_CONSTITUTION);
export const setCombatantWisdom = simpleAction(t.SET_COMBATANT_WISDOM);
export const setCombatantIntelligence = simpleAction(t.SET_COMBATANT_INTELLIGENCE);
export const setCombatantCharisma = simpleAction(t.SET_COMBATANT_CHARISMA);
export const setCombatantActions = simpleAction(t.SET_COMBATANT_ACTIONS);
export const setCombatantCR = simpleAction(t.SET_COMBATANT_CR);
export const setChosenCombatant = simpleAction(t.SET_CHOSEN_COMBATANT);


export const loadCombatant = (c) => (dispatch, getState) => {
  let combatant = Object.keys(c)[0]
  dispatch(setChosenCombatant(combatant));

  SimulatorSource.loadCombatant(combatant).then(({data}) => {
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

