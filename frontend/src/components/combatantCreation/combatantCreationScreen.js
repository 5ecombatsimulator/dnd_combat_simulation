import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import "react-table/react-table.css";
import * as actions from '../../actions/actions'
import ActionTable from '../simulation/actionTable'
import '../../index.css';

import { Button, Input, Grid } from 'semantic-ui-react'

const CombatantCreationScreen = ({allActions, combatantActions, updateCombatantActions, addCombatantAction, cr,
                           setCombatantName, setCombatantHP, setCombatantAC, setCombatantProficiency,
                           setCombatantStrength, setCombatantDexterity, setCombatantConstitution,
                           setCombatantWisdom, setCombatantIntelligence, setCombatantCharisma,
                           createCombatant}) => (
  <div>
    <h1> Create a combatant:</h1>
    <Grid columns="two">
      <Grid.Row className="row">
        <Grid.Column>
          <h3>Combatant information:</h3>
          <Grid columns="two" divided>
            <Grid.Row>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Name
                  </div>
                  <input value={cr.combatantName}
                         onChange={setCombatantName}
                         placeholder="Name..."/>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Hit points
                  </div>
                  <input value={cr.combatantHP}
                         onChange={setCombatantHP}
                         type="number" min="1"/>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Armor class
                  </div>
                  <input value={cr.combatantAC}
                         onChange={setCombatantAC}
                         type="number" min="8"/>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Proficiency Bonus
                  </div>
                  <input value={cr.combatantProficiency}
                         onChange={setCombatantProficiency}
                         type="number" min="0"/>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <h3>Combatant Stats</h3>
          <Grid columns="two" divided>
            <Grid.Row>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Strength
                  </div>
                  <input value={cr.combatantStrength}
                         placeholder="Strength"
                         onChange={setCombatantStrength}
                         type="number" min="1"/>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Dexterity
                  </div>
                  <input value={cr.combatantDexterity}
                         placeholder="Dexterity"
                         onChange={setCombatantDexterity}
                         type="number" min="1"/>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Constitution
                  </div>
                  <input value={cr.combatantConstitution}
                       placeholder="Constitution"
                       onChange={setCombatantConstitution}
                       type="number" min="1"/>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Intelligence
                  </div>
                  <input value={cr.combatantIntelligence}
                         placeholder="Intelligence"
                         onChange={setCombatantIntelligence}
                         type="number" min="1"/>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Wisdom
                  </div>
                  <input value={cr.combatantWisdom}
                                placeholder="Wisdom"
                                onChange={setCombatantWisdom}
                                type="number" min="1"/>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className='ui fluid labeled input'>
                  <div className="ui label">
                    Charisma
                  </div>
                  <input value={cr.combatantCharisma}
                                placeholder="Charisma"
                                onChange={setCombatantCharisma}
                                type="number" min="1"/>
                </div>
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