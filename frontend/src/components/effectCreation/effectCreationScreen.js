import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import '../../index.css';

import {DynamicSizeNumericInput, DynamicSizeTextInput} from "../utils";
import { Button, Grid } from 'semantic-ui-react'
import * as actions from "../../actions/effectCreationActions";

import StunEffectScreen from "./StunEffectCreationScreen"

const SpecificEffectScreen = ({effectType}) => {
  if (effectType.value === "StunEffect") {
    return <StunEffectScreen/>
  }
  else {
    return <div/>
  }
}


const EffectCreationScreen = ({er, setEffectName, setEffectType}) => (
  <div>
    <h1> Create an effect: </h1>
    <Grid columns="one">
      <Grid.Column>
        <DynamicSizeTextInput labelValue="Name"
                              inputValue={er.effectName}
                              changeFunc={setEffectName}
                              placeholderValue="Name..."/>
        <Select className="paddedDiv"
                  value={er.effectType}
                  placeholder={"Effect type"}
                  onChange={setEffectType}
                  options={[{'value': "StunEffect", "label": "StunEffect"}]}

        />
        <SpecificEffectScreen effectType={er.effectType}/>
      </Grid.Column>
    </Grid>
  </div>
)

class Container extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    return <EffectCreationScreen {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  er: state.effectCreationReducer,
})

const mapDispatchToProps = (dispatch) => ({
  setEffectName: (e) => dispatch(actions.setEffectName(e.target.value)),
  setEffectType: (e) => dispatch(actions.setEffectType(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)
