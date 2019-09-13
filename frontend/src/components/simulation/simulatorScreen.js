import React from 'react'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../actions/actions'
import CombatantTable from './combatantTable'
import ResultsScreen from './ResultsScreen'

import { Button, Input, Grid } from 'semantic-ui-react'

const SimulatorScreen = () => {
  let {team1Combatants, allCombatants, team2Combatants, battleKey, battleKeyMessage, battleLoadMessage} = useSelector(state => state.combatantSelectionReducer)

  const dispatch = useDispatch()
  const team1Update = (newSet) => dispatch(actions.updateT1Combatants(newSet))
  const team2Update = (newSet) => dispatch(actions.updateT2Combatants(newSet))
  const team1Add = (newSet) => dispatch(actions.addT1Combatant(newSet))
  const team2Add = (newSet) => dispatch(actions.addT2Combatant(newSet))
  const setBattleKey = (e) => dispatch(actions.setBattleKey(e.target.value))
  const runSimulation = () => dispatch(actions.runSimulation())
  const saveBattle = () => dispatch(actions.saveBattle())
  const loadBattle = () => dispatch(actions.loadBattle())

  if (allCombatants.length < 1) {
    dispatch(actions.getAllCombatants())
  }

  return (
    <div>
      <Grid stackable>
        <div className="row">
          <div className="eight wide column">
            <Select
              closeOnSelect={false}
              isMulti
              onChange={team1Update}
              options={allCombatants}
              placeholder="Team 1 combatants"
              removeSelected={false}
              value={team1Combatants}
            />
            <CombatantTable onClickFunction={team1Add}/>
          </div>
          <div className="eight wide column">
            <Select
              closeOnSelect={false}
              isMulti
              onChange={team2Update}
              options={allCombatants}
              placeholder="Team 2 combatants"
              removeSelected={false}
              value={team2Combatants}
            />
            <CombatantTable onClickFunction={team2Add}/>
          </div>
        </div>

        <div className="row">
          <div className="five wide column">
            <Button secondary onClick={saveBattle}>Save battle</Button>
            <h5 style={{color:battleKeyMessage.indexOf("Success") !== -1 ? "#007f00" : "#e50000"}}>{battleKeyMessage}</h5>
          </div>
          <div className="six wide column">
            <Button primary onClick={runSimulation}>Fight!</Button>
          </div>
          <div className="five wide column">
            <Input style={{float:"center"}} type='text' value={battleKey} onChange={setBattleKey} placeholder="Battle key" action>
              <input />
              <Button secondary onClick={loadBattle} type='submit'>Load battle</Button>
            </Input>
            <h5 style={{color:battleLoadMessage.indexOf("Success") !== -1 ? "#007f00" : "#e50000"}}>{battleLoadMessage}</h5>
          </div>
        </div>
      </Grid>
      <ResultsScreen />
    </div>
  )
}

export default SimulatorScreen