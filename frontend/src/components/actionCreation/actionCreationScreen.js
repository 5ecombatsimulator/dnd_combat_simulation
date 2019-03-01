import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import '../../index.css';

import AttackAgainstACScreen from "./attackAgainstACScreen"
import SpellAttackSaveScreen from "./spellAttackSaveScreen"
import * as arActions from '../../actions/actionCreationActions'


const ActionCreationScreen = ({resetTabAttributes}) => (
  <div>
    <Tabs onSelect={() => resetTabAttributes()}>
      <TabList>
        <Tab>Create attack against AC</Tab>
        <Tab>Create attack requiring save</Tab>
      </TabList>

      <TabPanel>
        <AttackAgainstACScreen />
      </TabPanel>
      <TabPanel>
        <SpellAttackSaveScreen/>
      </TabPanel>
    </Tabs>
  </div>
)

class Container extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return <ActionCreationScreen {...this.props} />
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  resetTabAttributes: () => dispatch(arActions.resetTabAttributes()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)