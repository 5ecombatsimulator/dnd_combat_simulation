import React, { Component } from 'react';
import { connect } from 'react-redux'


import "react-tabs/style/react-tabs.css";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import {CrossedSwords, Magnifier, Flame, EditPerson} from "../assets/svgIcons";

import * as tcActions from '../actions/tabControllerActions'

import SimulatorScreen from './simulation/simulatorScreen'
import CombatantCreationScreen from './combatantCreation/combatantCreationScreen'
import AttackAgainstACCreationScreen from './actionCreation/attackAgainstACScreen'
import SpellAttackWithSaveCreationScreen from './actionCreation/spellAttackSaveScreen'
import EffectCreationScreen from './effectCreation/effectCreationScreen'
import ExploreCombatantScreen from './explore/exploreCombatant'
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
    // return <GeneralInfoScreen/>
  }
}

const TabMenu = ({setCurrentTab}) => {
  return <div className="ui vertical menu">
          <div className="ui dropdown item">
            Information
            <i className="dropdown icon"/>
            <div className="menu">
              <a className="item" onClick={() => setCurrentTab('generalInfo')}>Basic Info</a>
            </div>
          </div>
          <div className="ui dropdown item">
            Explore
            <i className="dropdown icon"/>
            <div className="menu">
              <a className="item" onClick={() => setCurrentTab('exploreCombatant')}>Combatants</a>
            </div>
          </div>
          <a className="item" onClick={() => setCurrentTab('Simulator')} name='Simulator'>Simulator</a>
          <a className="item" onClick={() => setCurrentTab('CombatantCreation')} name='CombatantCreation'>Combatant Creation</a>
          <div className="ui dropdown item">
            Action Creation
            <i className="dropdown icon"/>
            <div className="menu">
              <a className="item" onClick={() => setCurrentTab('AttackAgainstAC')}>Attack against AC</a>
              <a className="item" onClick={() => setCurrentTab('AttackWithSave')}>Attack requiring save</a>
            </div>
          </div>
          <a className="item" onClick={() => setCurrentTab('EffectCreation')} name="EffectCreation">Effect Creation</a>
        </div>
}

const SideNavComponent = ({setCurrentTab}) => (
  <SideNav
      onSelect={(selected) => {
          setCurrentTab(selected)
      }}>
      <SideNav.Toggle />
      <SideNav.Nav defaultSelected="Simulator">
          <NavItem eventKey="Simulator">
              <NavIcon>
                <CrossedSwords/>
              </NavIcon>
              <NavText>
                  Simulator
              </NavText>
          </NavItem>
          <NavItem eventKey="CombatantCreation">
              <NavIcon>
                <EditPerson/>
              </NavIcon>
              <NavText>
                  Create a combatant
              </NavText>
          </NavItem>
          <NavItem eventKey="actionCreation">
              <NavIcon>
                  <Flame/>
              </NavIcon>
              <NavText>
                  Action Creation
              </NavText>
              <NavItem eventKey="AttackAgainstAC">
                  <NavText>
                      Attack against AC
                  </NavText>
              </NavItem>
              <NavItem eventKey="AttackWithSave">
                  <NavText>
                      Attack requiring save
                  </NavText>
              </NavItem>
          </NavItem>
          <NavItem eventKey="exploration">
                <NavIcon>
                    <Magnifier/>
                </NavIcon>
                <NavText>
                    Explore
                </NavText>
                <NavItem eventKey="exploreCombatant">
                    <NavText>
                      Combatants
                    </NavText>
                </NavItem>
            </NavItem>
      </SideNav.Nav>
  </SideNav>
)

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
        <SideNavComponent setCurrentTab={this.props.setCurrentTab}/>
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