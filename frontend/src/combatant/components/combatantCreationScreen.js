import React from 'react'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import "react-table/react-table.css"
import * as actions from '../actions'
import {getAllActions} from '../../simulation/actions'
import ActionTable from './ActionTable'

import {DynamicSizeNumericInput, DynamicSizeTextInput} from "../../components/utils"

import { Button, Grid } from 'semantic-ui-react'

const CombatantCreationScreen = () => {
  const cr = useSelector(state => state.combatantCreationReducer)

  const dispatch = useDispatch()
  if (cr.allActions.length < 1)
    dispatch(getAllActions())

  const addCombatantAction = (combatantAction) => dispatch(actions.addCombatantAction(combatantAction))
  const updateCombatantActions = (updatedSet) => dispatch(actions.updateCombatantActions(updatedSet))
  const setCombatantName = (e) => dispatch(actions.setCombatantName(e.target.value))
  const setCombatantHP = (e) => dispatch(actions.setCombatantHP(e.target.value))
  const setCombatantAC = (e) => dispatch(actions.setCombatantAC(e.target.value))
  const setCombatantProficiency = (e) => dispatch(actions.setCombatantProficiency(e.target.value))
  const setCombatantStrength = (e) => dispatch(actions.setCombatantStrength(e.target.value))
  const setCombatantDexterity = (e) => dispatch(actions.setCombatantDexterity(e.target.value))
  const setCombatantConstitution = (e) => dispatch(actions.setCombatantConstitution(e.target.value))
  const setCombatantWisdom = (e) => dispatch(actions.setCombatantWisdom(e.target.value))
  const setCombatantIntelligence = (e) => dispatch(actions.setCombatantIntelligence(e.target.value))
  const setCombatantCharisma = (e) => dispatch(actions.setCombatantCharisma(e.target.value))
  const createCombatant = () => dispatch(actions.createCombatant())

  return (
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
              options={cr.allActions}
              placeholder="Add your combatant actions"
              removeSelected={true}
              value={cr.combatantActions}
            />
            <ActionTable actionAddFunction={addCombatantAction}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Button onClick={createCombatant} primary>Create Combatant</Button>
      <h5 style={{color:cr.combatantCreationMsg === "Success" ? "#007f00" : "#e50000"}}>{cr.combatantCreationMsg}</h5>
    </div>
  )
}

export default CombatantCreationScreen