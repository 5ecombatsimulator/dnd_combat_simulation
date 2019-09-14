/**
 * Created by Andrew on 1/16/18.
 */
import {simpleAction} from '../common/utils'
import get from '../common/actionUtils'
import SimulatorSource from '../common/sources/simulatorSource'
import * as t from './actionTypes'

/* Action types */
export const setAllCombatants = simpleAction(t.SET_ALL_COMBATANTS);
export const setAllActions = simpleAction(t.SET_ALL_ACTIONS);
export const setSimulationResults = simpleAction(t.SET_SIMULATION_RESULTS);
export const team1Update = simpleAction(t.SET_TEAM1_COMBATANTS)
export const team2Update = simpleAction(t.SET_TEAM2_COMBATANTS)
export const team1Add = simpleAction(t.ADD_TEAM1_COMBATANT)
export const team2Add = simpleAction(t.ADD_TEAM2_COMBATANT)
export const setBattleKey = simpleAction(t.SET_BATTLE_KEY);
export const setBattleKeyMessage = simpleAction(t.SET_BATTLE_KEY_MESSAGE);
export const setLoadBattleMessage = simpleAction(t.SET_LOAD_BATTLE_MESSAGE);

export const getAllCombatants = get(SimulatorSource.getCombatants, setAllCombatants);
export const getAllActions = get(SimulatorSource.getActions, setAllActions);

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
    dispatch(team1Update(data.team1));
    dispatch(team2Update(data.team2));
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
