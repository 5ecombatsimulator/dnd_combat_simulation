import React  from 'react';
import ReactTable from "react-table";
import { useSelector } from 'react-redux';

const columns = [
  {
    Header: "Name",
    columns: [
      {
        Header: "Action Name",
        accessor: "label"
      },
    ]
  },
  {
    Header: 'Stats',
    columns: [
      {
        Header: "Effects",
        accessor: "actionEffects"
      },
      {
        Header: "Expected Damage",
        accessor: "expDamage"
      },

    ]
  }
]

const getTdProps = (actionAddFunction) => (state, rowInfo) => ({
  onClick: () => {
    if (rowInfo !== undefined)
      actionAddFunction({value: rowInfo.original.value, label: rowInfo.original.label})
  }
})


const ActionTable = ({actionAddFunction}) => {
  let allActions = useSelector(state => state.combatantCreationReducer.allActions)

  return (
    <div>
      <ReactTable
        getTdProps={getTdProps(actionAddFunction)}
        data={allActions}
        columns={columns}
        defaultPageSize={10}
        className="-striped -highlight"
      />
      <br />
    </div>
  )
}

export default ActionTable