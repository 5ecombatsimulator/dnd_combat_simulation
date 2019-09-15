import React  from 'react'
import ReactTable from "react-table"
import "react-table/react-table.css"
import { useSelector } from 'react-redux'

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

  return (
    <div>
      <ReactTable
        getTdProps={getTdProps(onClickFunction)}
        data={allCombatants}
        columns={columns}
        defaultPageSize={10}
        className="-striped -highlight"
      />
      <br />
    </div>
  )
}

export default CombatantTable