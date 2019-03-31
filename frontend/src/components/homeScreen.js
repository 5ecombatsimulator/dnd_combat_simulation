import React, { Component } from 'react';
import { connect } from 'react-redux'


import "react-tabs/style/react-tabs.css";

import * as tcActions from '../actions/tabControllerActions'

import SimulatorScreen from './simulation/simulatorScreen'
import CombatantCreationScreen from './combatantCreation/combatantCreationScreen'
import AttackAgainstACCreationScreen from './actionCreation/attackAgainstACScreen'
import SpellAttackWithSaveCreationScreen from './actionCreation/spellAttackSaveScreen'
import EffectCreationScreen from './effectCreation/effectCreationScreen'
import ExploreCombatantScreen from './explore/exploreCombatant'
import SidebarNav from './Navbar'
import '../index.css';

import {Grid} from 'semantic-ui-react'

const RenderedContent = ({ tabName }) => {
  if (tabName === "Simulator") {
    return <SimulatorScreen />
  }
  else if (tabName === "CombatantCreation") {
    return <CombatantCreationScreen />
  }
  else if (tabName === "AttackAgainstAC") {
    return <AttackAgainstACCreationScreen/>
  }
  else if (tabName === "AttackWithSave") {
    return <SpellAttackWithSaveCreationScreen/>
  }
  else if (tabName === "EffectCreation") {
    return <EffectCreationScreen/>
  }
  else if (tabName === "exploreCombatant") {
    return <ExploreCombatantScreen/>
  }
  else if (tabName === "generalInfo") {
    return <div/>
    // return <GeneralInfoScreen/>
  }
}


class HomeScreen extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      sidebarOpen: false
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  render() {
    return (
      <body>
        <SidebarNav setCurrentTab={this.props.setCurrentTab}/>
        <Grid stackable>
          <Grid.Row>
            <div className="one wide column"/>
            <div className="fourteen wide column">
              <RenderedContent tabName={this.props.currentTab} />
            </div>
            <div className="one wide column"/>
          </Grid.Row>
        </Grid>
      </body>
    )
  }
}

const mapStateToProps = (state) => ({
  currentTab: state.tabController.currentTab
})

const mapDispatchToProps = (dispatch) => ({
  setCurrentTab: (t) => dispatch(tcActions.setCurrentTab(t)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)