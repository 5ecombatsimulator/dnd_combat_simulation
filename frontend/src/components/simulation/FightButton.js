
import React from 'react'
import { Button } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import {runSimulation} from '../../actions/actions'

export default function FightButton() {
  const dispatch = useDispatch()
  const run = () => dispatch(runSimulation())

  return (
    <div className="six wide column">
      <Button primary onClick={run}>Fight!</Button>
    </div>
  )
}