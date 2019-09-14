import React from 'react'
import { connect } from 'react-redux'


import "react-tabs/style/react-tabs.css"

import * as tcActions from '../actions/tabControllerActions'

import SimulatorScreen from './simulation/SimulatorScreen'
import CombatantCreationScreen from './combatantCreation/combatantCreationScreen'
import AttackAgainstACCreationScreen from './actionCreation/attackAgainstACScreen'
import SpellAttackWithSaveCreationScreen from './actionCreation/spellAttackSaveScreen'
import EffectCreationScreen from './effectCreation/effectCreationScreen'
import ExploreCombatantScreen from './explore/exploreCombatant'
import SidebarNav from './Navbar'
import '../index.css'

import {Grid} from 'semantic-ui-react'

const tabs = {
  "Simulator": SimulatorScreen,
  "CombatantCreation": CombatantCreationScreen,
  "AttackAgainstAC": AttackAgainstACCreationScreen,
  "AttackWithSave": SpellAttackWithSaveCreationScreen,
  "EffectCreation": EffectCreationScreen,
  "exploreCombatant": ExploreCombatantScreen,
  "generalInfo": () => (<div />)
}

const HomeScreen = (props) => {
  const RenderedContent = tabs[props.currentTab]

  return (
    <body>
      <SidebarNav setCurrentTab={props.setCurrentTab}/>
      <Grid stackable>
        <Grid.Row>
          <div className="one wide column"/>
          <div className="fourteen wide column">
            <RenderedContent tabName={props.currentTab} />
          </div>
          <div className="one wide column"/>
        </Grid.Row>
      </Grid>
    </body>
  )
}

const mapStateToProps = (state) => ({
  currentTab: state.tabController.currentTab
})

const mapDispatchToProps = (dispatch) => ({
  setCurrentTab: (t) => dispatch(tcActions.setCurrentTab(t)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)