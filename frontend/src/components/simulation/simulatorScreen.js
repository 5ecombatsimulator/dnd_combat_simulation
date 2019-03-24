import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import CombatantTable from './combatantTable'
import ResultsScreen from './ResultsScreen'
import '../../index.css';

import { Button, Input, Grid } from 'semantic-ui-react'

const SimulatorScreen = ({team1Combatants, team2Combatants, allCombatants, team1Update, team2Update,
                          team1Add, team2Add, runSimulation, saveBattle, loadBattle, setBattleKey,
                          battleKey, battleKeyMessage, battleLoadMessage}) => (
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
)

class Container extends React.Component{
  constructor(props) {
    super(props)
    props.getAllCombatants()
  }

  render() {
    return <div>
      <SimulatorScreen {...this.props} />
      <ResultsScreen {...this.props}/>
    </div>
  }
}

const mapStateToProps = (state) => ({
  team1Combatants: state.combatantSelectionReducer.team1Combatants,
  allCombatants: state.combatantSelectionReducer.allCombatants,
  team2Combatants: state.combatantSelectionReducer.team2Combatants,
  battleKey: state.combatantSelectionReducer.battleKey,
  battleKeyMessage: state.combatantSelectionReducer.battleKeyMessage,
  battleLoadMessage: state.combatantSelectionReducer.battleLoadMessage,
})

const mapDispatchToProps = (dispatch) => ({
  getAllCombatants: () => dispatch(actions.getAllCombatants()),
  team1Update: (newSet) => dispatch(actions.updateT1Combatants(newSet)),
  team2Update: (newSet) => dispatch(actions.updateT2Combatants(newSet)),
  team1Add: (newSet) => dispatch(actions.addT1Combatant(newSet)),
  team2Add: (newSet) => dispatch(actions.addT2Combatant(newSet)),
  setBattleKey: (e) => dispatch(actions.setBattleKey(e.target.value)),
  runSimulation: () => dispatch(actions.runSimulation()),
  saveBattle: () => dispatch(actions.saveBattle()),
  loadBattle: () => dispatch(actions.loadBattle())
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)