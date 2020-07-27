import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import {runSimulation} from '../actions'
import combatantSelectionReducer from "../reducers";


export default function FightButton(isEnabled) {
  const dispatch = useDispatch();
  const run = () => dispatch(runSimulation());

  let {runButtonDisabled} = useSelector(state => state.combatantSelectionReducer)

  return (
    <div className="six wide column">
      <Button primary onClick={run} disabled={runButtonDisabled}>Fight!</Button>
    </div>
  )
}