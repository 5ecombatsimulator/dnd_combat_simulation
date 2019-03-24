import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import "react-table/react-table.css";
import * as actions from '../../actions/actions'
import ActionTable from '../simulation/actionTable'
import '../../index.css';

import {DynamicSizeNumericInput, DynamicSizeTextInput} from "../utils";

import { Button, Grid } from 'semantic-ui-react'

const CombatantCreationScreen = ({allActions, combatantActions, updateCombatantActions, addCombatantAction, cr,
                           setCombatantName, setCombatantHP, setCombatantAC, setCombatantProficiency,
                           setCombatantStrength, setCombatantDexterity, setCombatantConstitution,
                           setCombatantWisdom, setCombatantIntelligence, setCombatantCharisma,
                           createCombatant}) => (
  <div>
    <h1> Create a combatant:</h1>
    <Grid columns="two" stackable>
      <Grid.Row className="row">
        <Grid.Column>
          <h3>Combatant information:</h3>
          <Grid columns="two" divided>
            <Grid.Row>
              <Grid.Column>
                <DynamicSizeTextInput labelValue="Name"
                                      inputValue={cr.combatantName}
                                      changeFunc={setCombatantName}
                                      placeholderValue="Name..."/>
              </Grid.Column>
              <Grid.Column>
                <DynamicSizeNumericInput labelValue="Hit points"
                                         inputValue={cr.combatantHP}
                                         changeFunc={setCombatantHP}
                                         minValue="1"/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <DynamicSizeNumericInput labelValue="Armor class"
                                         inputValue={cr.combatantAC}
                                         changeFunc={setCombatantAC}
                                         minValue="8"/>
              </Grid.Column>
              <Grid.Column>
                <DynamicSizeNumericInput labelValue="Proficiency Bonus"
                                         inputValue={cr.combatantProficiency}
                                         changeFunc={setCombatantProficiency}
                                         minValue="1"/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <h3>Combatant Stats</h3>
          <Grid columns="two" divided>
            <Grid.Row>
              <Grid.Column>
                <DynamicSizeNumericInput labelValue="Strength"
                                         inputValue={cr.combatantStrength}
                                         changeFunc={setCombatantStrength}
                                         minValue="1"/>
              </Grid.Column>
              <Grid.Column>
                <DynamicSizeNumericInput labelValue="Dexterity"
                                         inputValue={cr.combatantDexterity}
                                         changeFunc={setCombatantDexterity}
                                         minValue="1"/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <DynamicSizeNumericInput labelValue="Constitution"
                                         inputValue={cr.combatantConstitution}
                                         changeFunc={setCombatantConstitution}
                                         minValue="1"/>
              </Grid.Column>
              <Grid.Column>
                <DynamicSizeNumericInput labelValue="Intelligence"
                                         inputValue={cr.combatantIntelligence}
                                         changeFunc={setCombatantIntelligence}
                                         minValue="1"/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <DynamicSizeNumericInput labelValue="Wisdom"
                                         inputValue={cr.combatantWisdom}
                                         changeFunc={setCombatantWisdom}
                                         minValue="1"/>
              </Grid.Column>
              <Grid.Column>
                <DynamicSizeNumericInput labelValue="Charisma"
                                         inputValue={cr.combatantCharisma}
                                         changeFunc={setCombatantCharisma}
                                         minValue="1"/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Grid.Column>
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
        </Grid.Column>
      </Grid.Row>
    </Grid>
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