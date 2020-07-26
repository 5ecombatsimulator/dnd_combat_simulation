import React, {useState}  from 'react'
import ReactTable from "react-table"
import "react-table/react-table.css"
import { useSelector } from 'react-redux'
import { Input } from 'semantic-ui-react'

const getTdProps = (onClickFunction) => (state, rowInfo) => ({
  onClick: () => {
    if (rowInfo !== undefined) 
      onClickFunction({[rowInfo.original.label]: {quantity: 1}})
  }
})

const columns = [
  {
    Header: "Name",
    columns: [
      {
        Header: "Creature Name",
        accessor: "label"
      },
    ]
  },
  {
    Header: 'Stats',
    columns: [
      {
        Header: "Creature Rating",
        accessor: "cr"
      },
      {
        Header: "Type",
        accessor: "creatureType"
      },
      {
        Header: "Expected Damage",
        accessor: "expDamage"
      },

    ]
  }
]

const CombatantTable = ({onClickFunction}) => {
  let allCombatants = useSelector(state => state.combatantSelectionReducer.allCombatants)
  let [choices, setChoices] = useState(allCombatants)
  let [searchVal, setSearchVal] = useState('')

  const handleSearchChange = (e) => {
    let search = e.target.value
    setSearchVal(search)
    if (search == '') {
      setChoices(allCombatants)
      return
    }
    setChoices(allCombatants.filter((combatant) => combatant.name.includes(search)))
  }

  return (
    <div>
      <Input placeholder='Search...' type="text" onChange={handleSearchChange} value={searchVal}  />
      <ReactTable
        getTdProps={getTdProps(onClickFunction)}
        data={searchVal.length == 0 ? allCombatants : choices}
        columns={columns}
        defaultPageSize={10}
        className="-striped -highlight"
      />
      <br />
    </div>
  )
}

export default CombatantTable