import React  from 'react';
import '../App.css';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { connect } from 'react-redux';


const CombatantTable = ({allCombatants, teamAddFunction}) => (
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
              teamAddFunction({value: rowInfo.original.value, label: rowInfo.original.label})
            }
          }
        }
      }}
      data={allCombatants}
      columns={[
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
      ]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
    <br />
  </div>
)

const mapStateToProps = (state) => ({
  allCombatants: state.combatantSelectionReducer.allCombatants,
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(CombatantTable)