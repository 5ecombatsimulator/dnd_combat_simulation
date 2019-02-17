import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import "react-table/react-table.css";
import * as actions from '../actions'
import Grid from 'react-css-grid';
import ActionTable from './actionTable'
import '../index.css';

const CombatantCreation = ({allActions, combatantActions, updateCombatantActions, addCombatantAction, cr,
                           setCombatantName, setCombatantHP, setCombatantAC, setCombatantProficiency,
                           setCombatantStrength, setCombatantDexterity, setCombatantConstitution,
                           setCombatantWisdom, setCombatantIntelligence, setCombatantCharisma,
                           createCombatant}) => (
  <div>
    <h1> Create a combatant:</h1>
    <Grid width={320} gap={32}>
      <div className="section">
        <h4>Combatant Name:</h4>
        <input value={cr.combatantName} placeholder="Combatant name" onChange={setCombatantName}/>
        <h4>Hit points:</h4>
        <input value={cr.combatantHP} placeholder="Hit points" onChange={setCombatantHP} type="number" min="1"/>
        <h4>Armor Class:</h4>
        <input value={cr.combatantAC} placeholder="Armor class" onChange={setCombatantAC} type="number" min="8"/>
        <h4>Proficiency Bonus:</h4>
        <input value={cr.combatantProficiency} placeholder="Proficiency bonus" onChange={setCombatantProficiency} type="number" min="0"/>
        <h3>Saves</h3>
        <Grid width={160} gap={20}>
          <div className="section">
            <h4></h4>
            <input value={cr.combatantStrength} placeholder="Strength" onChange={setCombatantStrength} type="number" min="1"/>
            <h4></h4>
            <input value={cr.combatantDexterity} placeholder="Dexterity" onChange={setCombatantDexterity} type="number" min="1"/>
            <h4></h4>
            <input value={cr.combatantIntelligence} placeholder="Intelligence" onChange={setCombatantIntelligence} type="number" min="1"/>
          </div>
          <div className="section">
            <h4></h4>
            <input value={cr.combatantConstitution} placeholder="Constitution" onChange={setCombatantConstitution} type="number" min="1"/>
            <h4></h4>
            <input value={cr.combatantWisdom} placeholder="Wisdom" onChange={setCombatantWisdom} type="number" min="1"/>
            <h4></h4>
            <input value={cr.combatantCharisma} placeholder="Charisma" onChange={setCombatantCharisma} type="number" min="1"/>
          </div>
        </Grid>
      </div>
      <div className="section">
        <Select
          closeOnSelect={false}
          multi={true}
          onChange={updateCombatantActions}
          options={allActions}
          placeholder="Add your combatant actions"
          removeSelected={true}
          value={combatantActions}
        />
        <ActionTable actionAddFunction={addCombatantAction}/>
      </div>
    </Grid>
    <button className="button" onClick={createCombatant} type="button">Create Combatant</button>
  </div>
)

class Container extends React.Component{
  constructor(props) {
    super(props)
    props.getAllActions()
  }

  render() {
    return <CombatantCreation {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  allActions: state.combatantCreationReducer.allActions,
  combatantActions: state.combatantCreationReducer.combatantActions,
  cr: state.combatantCreationReducer,
})

const mapDispatchToProps = (dispatch) => ({
  getAllActions: () => dispatch(actions.getAllActions()),
  addCombatantAction: (combatantAction) => dispatch(actions.addCombatantAction(combatantAction)),
  updateCombatantActions: (updatedSet) => dispatch(actions.updateCombatantActions(updatedSet)),
  setCombatantName: (e) => dispatch(actions.setCombatantName(e.target.value)),
  setCombatantHP: (e) => dispatch(actions.setCombatantHP(e.target.value)),
  setCombatantAC: (e) => dispatch(actions.setCombatantAC(e.target.value)),
  setCombatantProficiency: (e) => dispatch(actions.setCombatantProficiency(e.target.value)),
  setCombatantStrength: (e) => dispatch(actions.setCombatantStrength(e.target.value)),
  setCombatantDexterity: (e) => dispatch(actions.setCombatantDexterity(e.target.value)),
  setCombatantConstitution: (e) => dispatch(actions.setCombatantConstitution(e.target.value)),
  setCombatantWisdom: (e) => dispatch(actions.setCombatantWisdom(e.target.value)),
  setCombatantIntelligence: (e) => dispatch(actions.setCombatantIntelligence(e.target.value)),
  setCombatantCharisma: (e) => dispatch(actions.setCombatantCharisma(e.target.value)),
  createCombatant: () => dispatch(actions.createCombatant())
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)