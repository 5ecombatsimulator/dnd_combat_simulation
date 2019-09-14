import React from 'react'
import { Button, Input } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../actions'

export default function LoadBattle() {
  let {battleKey, battleLoadMessage} = useSelector(state => state.combatantSelectionReducer)
  const dispatch = useDispatch()
  const setBattleKey = (e) => dispatch(actions.setBattleKey(e.target.value))
  const loadBattle = () => dispatch(actions.loadBattle())
  return (
    <div className="five wide column">
      <Input style={{float:"center"}} type='text' value={battleKey} onChange={setBattleKey} placeholder="Battle key" action>
        <input />
        <Button secondary onClick={loadBattle} type='submit'>Load battle</Button>
      </Input>
      <h5 style={{color:battleLoadMessage.indexOf("Success") !== -1 ? "#007f00" : "#e50000"}}>{battleLoadMessage}</h5>
    </div>
  )
}