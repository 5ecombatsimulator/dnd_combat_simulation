import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import * as actions from '../../actions/actions'
import Select from 'react-select'
import CombatantTable from './CombatantTable'

const Team = ({teamName}) => {
  const csr = useSelector(state => state.combatantSelectionReducer)
  const team = csr[teamName + 'Combatants']

  const dispatch = useDispatch()
  const teamUpdate = (newTeam) => dispatch(actions[teamName + 'Update'](newTeam))
  const teamAdd = (fighter) => dispatch(actions[teamName + 'Add'](fighter))

  return (
    <div className="eight wide column">
      <Select
        closeOnSelect={false}
        isMulti
        onChange={teamUpdate}
        options={csr.allCombatants}
        placeholder="Team 1 combatants"
        removeSelected={false}
        value={team}
      />
      <CombatantTable onClickFunction={teamAdd}/>
    </div>
  )
}

export default Team