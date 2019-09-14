import React from 'react'
import { Button } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import {saveBattle} from '../../actions/actions'

export default function SaveButton() {
  const {battleKeyMessage} = useSelector(state => state.combatantSelectionReducer)
  const dispatch = useDispatch()
  const save = () => dispatch(saveBattle())

  return (
    <div className="five wide column">
      <Button secondary onClick={save}>Save battle</Button>
      <h5 style={{color:battleKeyMessage.indexOf("Success") !== -1 ? "#007f00" : "#e50000"}}>{battleKeyMessage}</h5>
    </div>
  )
}