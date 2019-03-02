import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

import SimulatorScreen from './simulation/simulatorScreen'
import CombatantCreationScreen from './combatantCreation/combatantCreationScreen'
import AttackAgainstACCreationScreen from './actionCreation/attackAgainstACScreen'
import SpellAttackWithSaveCreationScreen from './actionCreation/spellAttackSaveScreen'
import '../index.css';

import { GridColumn } from 'semantic-ui-react'

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
}

class HomeScreen extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      renderTab: 'Simulator'
    }
  }

  changeTab(tabName) {
        this.setState({ renderTab: tabName })
  }

  render() {
    const { renderTab } = this.state;
    return (
      <div className="ui grid">
        <div className="row">
          <div className="ui horizontal menu" style={{margin: "auto"}}>
            <a className="item" onClick={() => this.changeTab('Simulator')} name='Simulator'>Simulator</a>
            <a className="item" onClick={() => this.changeTab('CombatantCreation')} name='CombatantCreation'>Combatant Creation</a>
            <div className="ui simple dropdown item">
              Action Creation
              <i className="dropdown icon"/>
              <div className="menu">
                <a className="item" onClick={() => this.changeTab('AttackAgainstAC')}>Attack against AC</a>
                <a className="item" onClick={() => this.changeTab('AttackWithSave')}>Attack requiring save</a>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="one wide column"/>
          <div className="fourteen wide column">
            <RenderedContent tabName={renderTab} />
          </div>
          <div className="one wide column"/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)