/**
 * Created by Andrew on 1/16/18.
 */
import {setterAction} from '../common/utils'
import get from '../common/actionUtils'
import SimulatorSource from '../common/sources/simulatorSource'
import * as t from './actionTypes'

/* Action types */
export const setAllCombatants = setterAction(t.SET_ALL_COMBATANTS);
export const setAllActions = setterAction(t.SET_ALL_ACTIONS);
export const setT1Combatants = setterAction(t.SET_TEAM1_COMBATANTS);
export const setT2Combatants = setterAction(t.SET_TEAM2_COMBATANTS);
export const setCounter = setterAction(t.INCREMENT_COUNTER);
export const setSimulationResults = setterAction(t.SET_SIMULATION_RESULTS);

export const setBattleKey = setterAction(t.SET_BATTLE_KEY);
export const setBattleKeyMessage = setterAction(t.SET_BATTLE_KEY_MESSAGE);
export const setLoadBattleMessage = setterAction(t.SET_LOAD_BATTLE_MESSAGE);

function updateCombatantSet(counter, oldSet, newSet) {
  // Get the new item by seeing what changed from the previous state (filter and get the first item)
  let newItem = newSet.filter(function(i) {return oldSet.indexOf(i) < 0;})[0];

  let updatedSet = newSet;

  // If there was a new item, then we add it to the current state by concatenating it
  // to the currentState value and append an arbitrary counter to the end to keep it unique.
  // If there isn't a new item in the state, then it was a delete and we simply take the newState
  if (newItem !== undefined) {
    updatedSet = oldSet.concat(
      {
        label: newItem.label,
        value: newItem.value + "_" + counter.toString()
      }
    )
  }

  return updatedSet
}

function addCombatantToSet(combatant, counter, set) {

  return set.concat({
    value: combatant.value + "_" + counter.toString(),
    label: combatant.label
  });

}

export const getAllCombatants = get(SimulatorSource.getCombatants, setAllCombatants);
export const getAllActions = get(SimulatorSource.getActions, setAllActions);

export const team1Update = (newSet) => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team1Combatants, counter} = combatantSelectionReducer;
  // Must increment the counter each time to keep the appended values unique
  dispatch(setCounter(counter + 1));
  let updatedSet = updateCombatantSet(counter, team1Combatants, newSet);
  dispatch(setT1Combatants(updatedSet))
};

export const team2Update = (newSet) => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team2Combatants, counter} = combatantSelectionReducer;
  // Must increment the counter each time to keep the appended values unique
  dispatch(setCounter(counter + 1));

  let updatedSet = updateCombatantSet(counter, team2Combatants, newSet);

  dispatch(setT2Combatants(updatedSet))
};

export const team1Add = (newCombatant) => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team1Combatants, counter} = combatantSelectionReducer;
  // Must increment the counter each time to keep the appended values unique
  dispatch(setCounter(counter + 1));

  dispatch(setT1Combatants(addCombatantToSet(newCombatant, counter, team1Combatants)))
};

export const team2Add = (newCombatant) => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team2Combatants, counter} = combatantSelectionReducer;
  // Must increment the counter each time to keep the appended values unique
  dispatch(setCounter(counter + 1));

  dispatch(setT2Combatants(addCombatantToSet(newCombatant, counter, team2Combatants)))
};

export const saveBattle = () => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team1Combatants, team2Combatants} = combatantSelectionReducer;
  SimulatorSource.saveBattle(
    team1Combatants.map((x) => x.label),
    team2Combatants.map((x) => x.label)
  ).then(({data}) => {
    let updatedMsg = "";
    if (data.msg === "Successfully saved") {
      updatedMsg = "Successfully saved with battle key: " + data.battleKey
    }
    else {
      updatedMsg = data.msg
    }
    dispatch(setBattleKeyMessage(updatedMsg));
  })
};

export const loadBattle = () => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {battleKey} = combatantSelectionReducer;
  SimulatorSource.loadBattle(battleKey).then(({data}) => {
    dispatch(setT1Combatants(data.team1));
    dispatch(setT2Combatants(data.team2));
    dispatch(setLoadBattleMessage(data.msg));
  })
}

export const runSimulation = () => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team1Combatants, team2Combatants} = combatantSelectionReducer;
  SimulatorSource.runSimulation(
    team1Combatants.map((x) => x.label),
    team2Combatants.map((x) => x.label)
  ).then(({data}) => {
    dispatch(setSimulationResults(data))
  })
};
