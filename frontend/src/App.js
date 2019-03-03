import React, { Component } from 'react';
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import './styles/paddingStyles.css'
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
    </div>
  </BrowserRouter>
)

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter)