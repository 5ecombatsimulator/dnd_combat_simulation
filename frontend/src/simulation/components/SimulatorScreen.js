import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import "../../styles/textStyles.css"
import * as actions from '../actions'
import ResultsScreen from './ResultsScreen'
import Team from './Team'
import SaveButton from './SaveButton'

import { Grid } from 'semantic-ui-react'
import FightButton from './FightButton'
import LoadBattle from './LoadBattle'

const SimulatorScreen = () => {
  let {allCombatants} = useSelector(state => state.combatantSelectionReducer)

  const dispatch = useDispatch()
  if (allCombatants.length < 1) {
    dispatch(actions.getAllCombatants())
  }

  return (
    <div>
      <Grid stackable>
        <div className="row">
          <Team teamName="team1" viewName="Team 1" />
          <Team teamName="team2" viewName="Team 2"/>
        </div>
        <div className="row">
          <SaveButton />
          <FightButton />
          <LoadBattle />
        </div>
      </Grid>
      <ResultsScreen />
    </div>
  )
}

export default SimulatorScreen