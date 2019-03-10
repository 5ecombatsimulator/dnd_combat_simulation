import React  from 'react';
import '../../App.css';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { connect } from 'react-redux';
import * as arActions from '../../actions/actionCreationActions'


const EffectTable = ({allEffects, addEffectFunction}) => (
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
              addEffectFunction({value: rowInfo.original.value, label: rowInfo.original.label})
            }
          }
        }
      }}
      data={allEffects}
      columns={[
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
      ]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
    <br />
  </div>
);

class Container extends React.Component{
  constructor(props) {
    super(props);
    props.getAllEffects()
  }

  render() {
    return <EffectTable {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  allEffects: state.actionCreationReducer.allEffects,
})

const mapDispatchToProps = (dispatch) => ({
  getAllEffects: () => dispatch(arActions.getAllEffects()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)