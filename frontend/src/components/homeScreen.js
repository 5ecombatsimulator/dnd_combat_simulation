import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

import SimulatorScreen from './simulation/simulatorScreen'
import CombatantCreationScreen from './combatantCreation/combatantCreationScreen'
import ActionCreationScreen from './actionCreation/actionCreationScreen'
import '../index.css';

const HomeScreen = ({}) => (
  <div>
    <Tabs>
      <TabList>
        <Tab>Combat Simulator</Tab>
        <Tab>Create a combatant</Tab>
        <Tab>Create an action</Tab>
      </TabList>

      <TabPanel>
        <SimulatorScreen />
      </TabPanel>
      <TabPanel>
        <CombatantCreationScreen />
      </TabPanel>
      <TabPanel>
        <ActionCreationScreen />
      </TabPanel>
    </Tabs>
  </div>
)

class Container extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    return <HomeScreen {...this.props} />
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Container)