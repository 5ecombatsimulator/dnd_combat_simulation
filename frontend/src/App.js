import React, { Component } from 'react';
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import CombatantScreen from './components/combatantScreen'
import ResultsScreen from './components/ResultsScreen'
import CombatantCreation from './components/combatantCreation'
import PhysicalAttackCreation from './components/actionCreation/actionCreationScreen'
import { connect } from 'react-redux'

const SimulatorScreen = ({...props}) => (
  <div>
    <CombatantScreen {...props}/>
    <ResultsScreen {...props}/>
  </div>
);

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({

})

const AppRouter = () => (
  <BrowserRouter>
    <div className="App">
      <Route path='/simulator/' component={SimulatorScreen}/>
      <Route path='/combatant_creator/' component={CombatantCreation}/>
      <Route path='/action_creator/' component={PhysicalAttackCreation}/>
    </div>
  </BrowserRouter>
)

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter)