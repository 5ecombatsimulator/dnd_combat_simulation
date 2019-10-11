import * as t from './actionTypes'
import {simpleAction} from '../common/utils'
import SimulatorSource from '../common/sources/simulatorSource'
import {setAllCombatants} from '../simulation/actions'

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
export const setCombatantCreationMsg = simpleAction(t.SET_COMBATANT_MSG);

export const addCombatantAction = (newAction) => (dispatch, getState) => {
    /*
     * Kind of a hacky way to insert into the list... thought the list should
     * never be all that long so seems okay. Maybe revisit if this call ends up
     * taking a lot of time.
     */
    let {combatantCreationReducer} = getState();
    let {combatantActions} = combatantCreationReducer;
    for (let key in combatantActions) {
      if (combatantActions[key].value === newAction.value) {
        return
      }
    }
    dispatch(setCombatantActions(combatantActions.concat(newAction)));
  }
  
  export const updateCombatantActions = (newState) => (dispatch, getState) => {
    dispatch(setCombatantActions(newState));
  }
  
  export const createCombatant = () => (dispatch, getState) => {
    let {combatantCreationReducer} = getState();
    let {combatantActions} = combatantCreationReducer;
    SimulatorSource.createCombatant(
      combatantCreationReducer.combatantName,
      combatantCreationReducer.combatantHP,
      combatantCreationReducer.combatantAC,
      combatantCreationReducer.combatantProficiency,
      combatantCreationReducer.combatantStrength,
      combatantCreationReducer.combatantConstitution,
      combatantCreationReducer.combatantDexterity,
      combatantCreationReducer.combatantWisdom,
      combatantCreationReducer.combatantIntelligence,
      combatantCreationReducer.combatantCharisma,
      combatantActions.map((a) => a.value).join(',')
    ).then(({data}) => {
      if (data.combatants) {
        dispatch(setAllCombatants(data.combatants))
      }
      dispatch(setCombatantCreationMsg(data.msg))
    })
  }