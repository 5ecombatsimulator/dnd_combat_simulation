import React  from 'react';
import '../App.css';
import ReactTable from "react-table";
import { connect } from 'react-redux';
import * as actions from '../actions'


const ActionTable = ({allActions, actionAddFunction}) => (
  <div>
    <ReactTable
      getTdProps={(state, rowInfo, column, instance) => {
        return {
          onClick: (e, handleOriginal) => {
            // IMPORTANT! React-Table uses onClick internally to trigger
            // events like expanding SubComponents and pivots.
            // By default a custom 'onClick' handler will override this functionality.
            // If you want to fire the original onClick handler, call the
            // 'handleOriginal' function.
            // if (handleOriginal) {
            //   handleOriginal()
            // }
            if (rowInfo !== undefined) {
              actionAddFunction({value: rowInfo.original.value, label: rowInfo.original.label})
            }
          }
        }
      }}
      data={allActions}
      columns={[
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
          columns: [,
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
      ]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
    <br />
  </div>
)

const mapStateToProps = (state) => ({
  allActions: state.combatantCreationReducer.allActions,
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(ActionTable)