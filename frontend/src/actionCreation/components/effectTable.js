import React  from 'react'
import ReactTable from "react-table"
import "react-table/react-table.css"
import { useSelector, useDispatch } from 'react-redux'
import * as arActions from '../actions'

const getTdProps = (addEffectFunction) => (state, rowInfo, column, instance) => {
  return {
    onClick: (e, handleOriginal) => {
      if (rowInfo !== undefined) {
        addEffectFunction({value: rowInfo.original.value, label: rowInfo.original.label})
      }
    }
  }
}

const columns = [
  {
    Header: "Name",
    columns: [
      {
        Header: "Effect Name",
        accessor: "label"
      },
    ]
  },
  {
    Header: 'Stats',
    columns: [
      {
        Header: "Effect type",
        accessor: "type"
      },
      {
        Header: "Description",
        accessor: "description"
      },
    ]
  }
]

const EffectTable = ({addEffectFunction}) => {
  const allEffects = useSelector(state => state.actionCreationReducer.allEffects)
  const effectsGotten = useSelector(state => state.actionCreationReducer.effectsGotten)

  const dispatch = useDispatch()
  if (!effectsGotten) {
    dispatch(arActions.getAllEffects())
    dispatch(arActions.setEffectsGotten(true))
  }

  return (
    <div>
      <ReactTable
        getTdProps={getTdProps(addEffectFunction)}
        data={allEffects}
        columns={columns}
        defaultPageSize={10}
        className="-striped -highlight"
      />
      <br />
    </div>
  )
}

export default EffectTable