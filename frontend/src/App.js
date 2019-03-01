import React, { Component } from 'react';
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import CombatantScreen from './components/simulation/simulatorScreen'
import ResultsScreen from './components/simulation/ResultsScreen'
import CombatantCreation from './components/combatantCreation/combatantCreationScreen'
import ActionCreationScreen from './components/actionCreation/actionCreationScreen'
import HomeScreen from './components/homeScreen'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({

})

const AppRouter = () => (
  <BrowserRouter>
    <div className="App">
      <Route path='/' component={HomeScreen}/>
      {/*<Route path='/action_creator' component={ActionCreationScreen}/>*/}
      {/*<Route path='/simulator/' component={SimulatorScreen}/>*/}
      {/*<Route path='/combatant_creator/' component={CombatantCreation}/>*/}
    </div>
  </BrowserRouter>
)

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter)