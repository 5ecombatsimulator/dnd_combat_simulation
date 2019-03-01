import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import * as actions from '../../actions/actions'
import Grid from 'react-css-grid';
import CombatantTable from './combatantTable'
import ResultsScreen from './ResultsScreen'
import '../../index.css';

const SimulatorScreen = ({team1Combatants, team2Combatants, allCombatants, team1Update, team2Update,
                          team1Add, team2Add, runSimulation, saveBattle, loadBattle, setBattleKey,
                          battleKey, battleKeyMessage, battleLoadMessage}) => (
  <div>
    <Grid width={320} gap={32}>
      <div className="section">
        <Select
          closeOnSelect={false}
          isMulti
          onChange={team1Update}
          options={allCombatants}
          placeholder="Choose your combatants!"
          removeSelected={false}
          value={team1Combatants}
        />
        <CombatantTable teamAddFunction={team1Add}/>
      </div>
      <div className="section">
        <Select
          closeOnSelect={false}
          isMulti
          onChange={team2Update}
          options={allCombatants}
          placeholder="Choose your combatants!"
          removeSelected={false}
          value={team2Combatants}
        />
        <CombatantTable teamAddFunction={team2Add}/>
      </div>
    </Grid>
    <Grid>
      <div><button className="button" onClick={runSimulation} type="button">Fight!</button></div>
      <div>
        <button className="button" onClick={saveBattle} type="button">Save battle</button>
        <h5 style={{color:battleKeyMessage.indexOf("Success") !== -1 ? "#007f00" : "#e50000"}}>{battleKeyMessage}</h5>
      </div>
      <div>
        <button className="button" onClick={loadBattle} type="button">Load battle</button>
        <input value={battleKey} onChange={setBattleKey} placeholder="Enter battle key to load combatants"/>
        <h5 style={{color:battleLoadMessage.indexOf("Success") !== -1 ? "#007f00" : "#e50000"}}>{battleLoadMessage}</h5>
      </div>
    </Grid>
  </div>
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