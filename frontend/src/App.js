import React, { Component } from 'react';
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import './styles/paddingStyles.css'
import HomeScreen from './components/homeScreen'

const AppRouter = () => (
  <BrowserRouter>
    <div className="App">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      </head>
      <Route path='/' component={HomeScreen}/>
    </div>
  </BrowserRouter>
)

export default AppRouter