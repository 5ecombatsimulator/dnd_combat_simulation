import {setterAction} from '../common'
import get from './utils'
import SimulatorSource from '../sources/simulatorSource'

/* Action types */
export const SET_COMBATANT_NAME = "SET_COMBATANT_NAME";
export const SET_COMBATANT_HP = 'SET_COMBATANT_HP';
export const SET_COMBATANT_AC = 'SET_COMBATANT_AC';
export const SET_COMBATANT_PROFICIENCY = 'SET_COMBATANT_PROFICIENCY';
export const SET_COMBATANT_STRENGTH = 'SET_COMBATANT_STRENGTH';
export const SET_COMBATANT_DEXTERITY = 'SET_COMBATANT_DEXTERITY';
export const SET_COMBATANT_CONSTITUTION = 'SET_COMBATANT_CONSTITUTION';
export const SET_COMBATANT_WISDOM = 'SET_COMBATANT_WISDOM';
export const SET_COMBATANT_INTELLIGENCE = 'SET_COMBATANT_INTELLIGENCE';
export const SET_COMBATANT_CHARISMA = 'SET_COMBATANT_CHARISMA';
export const SET_COMBATANT_ACTIONS = 'SET_COMBATANT_ACTIONS';
export const SET_COMBATANT_CR = 'SET_COMBATANT_CR';
export const SET_CHOSEN_COMBATANT = 'SET_CHOSEN_COMBATANT';

export const setCombatantName = setterAction(SET_COMBATANT_NAME);
export const setCombatantHP = setterAction(SET_COMBATANT_HP);
export const setCombatantAC = setterAction(SET_COMBATANT_AC);
export const setCombatantProficiency = setterAction(SET_COMBATANT_PROFICIENCY);
export const setCombatantStrength = setterAction(SET_COMBATANT_STRENGTH);
export const setCombatantDexterity = setterAction(SET_COMBATANT_DEXTERITY);
export const setCombatantConstitution = setterAction(SET_COMBATANT_CONSTITUTION);
export const setCombatantWisdom = setterAction(SET_COMBATANT_WISDOM);
export const setCombatantIntelligence = setterAction(SET_COMBATANT_INTELLIGENCE);
export const setCombatantCharisma = setterAction(SET_COMBATANT_CHARISMA);
export const setCombatantActions = setterAction(SET_COMBATANT_ACTIONS);
export const setCombatantCR = setterAction(SET_COMBATANT_CR);
export const setChosenCombatant = setterAction(SET_CHOSEN_COMBATANT);

export const loadCombatant = (combatant) => (dispatch, getState) => {
  dispatch(setChosenCombatant(combatant.value));

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

