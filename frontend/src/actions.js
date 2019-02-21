/**
 * Created by Andrew on 1/16/18.
 */
import {setterAction} from './common'
import SimulatorSource from './sources/simulatorSource'

/* Action types */
export const SET_TEAM1_COMBATANTS = 'SET_TEAM1_COMBATANTS';
export const SET_TEAM2_COMBATANTS = 'SET_TEAM2_COMBATANTS';
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const SET_ALL_COMBATANTS = 'SET_ALL_COMBATANTS';
export const SET_SIMULATION_RESULTS = 'SET_SIMULATION_RESULTS';
export const SET_ALL_ACTIONS = 'SET_ALL_ACTIONS';
export const SET_COMBATANT_ACTIONS = 'SET_COMBATANT_ACTIONS';
export const SET_COMBATANT_MSG = 'SET_COMBATANT_MSG';

export const SET_BATTLE_KEY = 'SET_BATTLE_KEY';
export const SET_BATTLE_KEY_MESSAGE = "SET_BATTLE_KEY_MESSAGE";
export const SET_LOAD_BATTLE_MESSAGE = "SET_LOAD_BATTLE_MESSAGE";

export const SET_COMBATANT_NAME = 'SET_COMBATANT_NAME';
export const SET_COMBATANT_HP = 'SET_COMBATANT_HP';
export const SET_COMBATANT_AC = 'SET_COMBATANT_AC';
export const SET_COMBATANT_PROFICIENCY = 'SET_COMBATANT_PROFICIENCY';
export const SET_COMBATANT_STRENGTH = 'SET_COMBATANT_STRENGTH';
export const SET_COMBATANT_DEXTERITY = 'SET_COMBATANT_DEXTERITY';
export const SET_COMBATANT_CONSTITUTION = 'SET_COMBATANT_CONSTITUTION';
export const SET_COMBATANT_WISDOM = 'SET_COMBATANT_WISDOM';
export const SET_COMBATANT_INTELLIGENCE = 'SET_COMBATANT_INTELLIGENCE';
export const SET_COMBATANT_CHARISMA = 'SET_COMBATANT_CHARISMA';

export const setAllCombatants = setterAction(SET_ALL_COMBATANTS);
export const setAllActions = setterAction(SET_ALL_ACTIONS);
export const setT1Combatants = setterAction(SET_TEAM1_COMBATANTS);
export const setT2Combatants = setterAction(SET_TEAM2_COMBATANTS);
export const setCounter = setterAction(INCREMENT_COUNTER);
export const setSimulationResults = setterAction(SET_SIMULATION_RESULTS);
export const setCombatantActions = setterAction(SET_COMBATANT_ACTIONS);
export const setCombatantCreationMsg = setterAction(SET_COMBATANT_MSG);

export const setBattleKey = setterAction(SET_BATTLE_KEY);
export const setBattleKeyMessage = setterAction(SET_BATTLE_KEY_MESSAGE);
export const setLoadBattleMessage = setterAction(SET_LOAD_BATTLE_MESSAGE);

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

const get = (sourceFunc, action, key) => (...args) => (dispatch) => {
  sourceFunc(...args).then((res) => {
    let data = key ? res.data[key] : res.data
    dispatch(action(data))
  })
}

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

export const getAllCombatants = get(SimulatorSource.getCombatants, setAllCombatants)
export const getAllActions = get(SimulatorSource.getActions, setAllActions)

export const updateT1Combatants = (newSet) => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team1Combatants, counter} = combatantSelectionReducer;
  // Must increment the counter each time to keep the appended values unique
  dispatch(setCounter(counter + 1));
  let updatedSet = updateCombatantSet(counter, team1Combatants, newSet);
  dispatch(setT1Combatants(updatedSet))
};

export const updateT2Combatants = (newSet) => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team2Combatants, counter} = combatantSelectionReducer;
  // Must increment the counter each time to keep the appended values unique
  dispatch(setCounter(counter + 1));

  let updatedSet = updateCombatantSet(counter, team2Combatants, newSet);

  dispatch(setT2Combatants(updatedSet))
};

export const addT1Combatant = (newCombatant) => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team1Combatants, counter} = combatantSelectionReducer;
  // Must increment the counter each time to keep the appended values unique
  dispatch(setCounter(counter + 1));

  dispatch(setT1Combatants(addCombatantToSet(newCombatant, counter, team1Combatants)))
};

export const addT2Combatant = (newCombatant) => (dispatch, getState) => {
  let {combatantSelectionReducer} = getState();
  let {team2Combatants, counter} = combatantSelectionReducer;
  // Must increment the counter each time to keep the appended values unique
  dispatch(setCounter(counter + 1));

  dispatch(setT2Combatants(addCombatantToSet(newCombatant, counter, team2Combatants)))
};

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
