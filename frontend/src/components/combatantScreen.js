import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import * as actions from '../actions'
import Grid from 'react-css-grid';
import CombatantTable from './combatantTable'
import '../index.css';

const CombatantScreen = ({team1Combatants, team2Combatants, allCombatants, team1Update, team2Update,
                         team1Add, team2Add, runSimulation}) => (
  <div>
    <Grid width={320} gap={32}>
      <div className="section">
        <Select
          closeOnSelect={false}
          multi={true}
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
          multi={true}
          onChange={team2Update}
          options={allCombatants}
          placeholder="Choose your combatants!"
          removeSelected={false}
          value={team2Combatants}
        />
        <CombatantTable teamAddFunction={team2Add}/>
      </div>
    </Grid>
    <button className="button" onClick={runSimulation} type="button">Fight!</button>
  </div>
)

class Container extends React.Component{
  constructor(props) {
    super(props)
    props.getAllCombatants()
  }

  render() {
    return <div>
      <CombatantScreen {...this.props} />
    </div>
  }
}

const mapStateToProps = (state) => ({
  team1Combatants: state.combatantSelectionReducer.team1Combatants,
  allCombatants: state.combatantSelectionReducer.allCombatants,
  team2Combatants: state.combatantSelectionReducer.team2Combatants,
})

const mapDispatchToProps = (dispatch) => ({
  getAllCombatants: () => dispatch(actions.getAllCombatants()),
  team1Update: (newSet) => dispatch(actions.updateT1Combatants(newSet)),
  team2Update: (newSet) => dispatch(actions.updateT2Combatants(newSet)),
  team1Add: (newSet) => dispatch(actions.addT1Combatant(newSet)),
  team2Add: (newSet) => dispatch(actions.addT2Combatant(newSet)),
  runSimulation: () => dispatch(actions.runSimulation())
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)