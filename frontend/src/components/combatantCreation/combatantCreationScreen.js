import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import "react-table/react-table.css";
import * as actions from '../../actions/actions'
import ActionTable from '../simulation/actionTable'
import '../../index.css';

import { Button, Input } from 'semantic-ui-react'

const CombatantCreationScreen = ({allActions, combatantActions, updateCombatantActions, addCombatantAction, cr,
                           setCombatantName, setCombatantHP, setCombatantAC, setCombatantProficiency,
                           setCombatantStrength, setCombatantDexterity, setCombatantConstitution,
                           setCombatantWisdom, setCombatantIntelligence, setCombatantCharisma,
                           createCombatant}) => (
  <div>
    <h1> Create a combatant:</h1>
    <div className="ui grid">
      <div className="row">
        <div className="eight wide column">
          <h3>Combatant information:</h3>
          <div className="ui two column grid">
            <div className="eight wide column">
              <Input value={cr.combatantName}
                     onChange={setCombatantName}
                     placeholder="Name..."
                     label={{ tag: false, content: 'Combatant Name' }}
                     labelPosition='left'
                     style={{float: 'center'}}/>
            </div>
            <div className="eight wide column">
              <Input value={cr.combatantHP}
                     onChange={setCombatantHP}
                     type="number" min="1"
                     label={{ tag: false, content: 'Combatant HP' }}
                     labelPosition='left'/>
            </div>
            <div className="eight wide column">
              <Input value={cr.combatantAC}
                     onChange={setCombatantAC}
                     type="number" min="8"
                     label={{ tag: false, content: 'Combatant AC' }}
                     labelPosition='left'/>
            </div>
            <div className="eight wide column">
              <Input value={cr.combatantProficiency}
                     onChange={setCombatantProficiency}
                     type="number" min="0"
                     label={{ tag: false, content: 'Combatant Proficiency' }}
                     labelPosition='left'/>
            </div>

          </div>
          <h3>Saves</h3>
          <div className="row">
            <div className="eight wide column">
              <Input value={cr.combatantStrength}
                     placeholder="Strength"
                     onChange={setCombatantStrength}
                     type="number" min="1"
                     label={{ tag: false, content: 'Strength' }}
                     labelPosition='left'/>
              <Input value={cr.combatantDexterity}
                     placeholder="Dexterity"
                     onChange={setCombatantDexterity}
                     type="number" min="1"
                     label={{ tag: false, content: 'Dexterity' }}
                     labelPosition='left'/>
              <Input value={cr.combatantConstitution}
                     placeholder="Constitution"
                     onChange={setCombatantConstitution}
                     type="number" min="1"
                     label={{ tag: false, content: 'Constitution' }}
                     labelPosition='left'/>
            </div>
            <div className="eight wide column">
              <Input value={cr.combatantIntelligence}
                     placeholder="Intelligence"
                     onChange={setCombatantIntelligence}
                     type="number" min="1"
                     label={{ tag: false, content: 'Intelligence' }}
                     labelPosition='left'/>
              <Input
                value={cr.combatantWisdom}
                placeholder="Wisdom"
                onChange={setCombatantWisdom}
                type="number" min="1"
                label={{ tag: false, content: 'Wisdom' }}
                labelPosition='left'/>
              <Input
                value={cr.combatantCharisma}
                placeholder="Charisma"
                onChange={setCombatantCharisma}
                type="number" min="1"
                label={{ tag: false, content: 'Charisma' }}
                labelPosition='left'/>
            </div>
          </div>
        </div>
        <div className="eight wide column">
          <Select
            closeOnSelect={false}
            isMulti
            onChange={updateCombatantActions}
            options={allActions}
            placeholder="Add your combatant actions"
            removeSelected={true}
            value={combatantActions}
          />
          <ActionTable actionAddFunction={addCombatantAction}/>
        </div>
      </div>
    </div>
    <Button onClick={createCombatant} primary>Create Combatant</Button>
    <h5 style={{color:cr.combatantCreationMsg === "Success" ? "#007f00" : "#e50000"}}>{cr.combatantCreationMsg}</h5>
  </div>
)

class Container extends React.Component{
  constructor(props) {
    super(props)
    props.getAllActions()
  }

  render() {
    return <CombatantCreationScreen {...this.props} />
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