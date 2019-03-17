import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import '../../index.css';

import {DynamicSizeNumericInput, DynamicSizeTextInput, statOptions} from "../utils";
import { Button, Grid } from 'semantic-ui-react'
import * as actions from "../../actions/effectCreationActions";

const ShowDamageDice = ({effectType}) => {
  return effectType === "DOT Effect"
}

const EffectCreationScreen = ({er, setEffectName, changeEffectType, createEffect,
                                setSaveDC, setSaveStat}) => (
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
                  onChange={changeEffectType}
                  options={[{'value': "StunEffect", "label": "StunEffect"}]}

        />
        {ShowDamageDice(er.effectType ? <h1>YES</h1>: <div/>)}
        {er.effectType !== "" ?
          <DynamicSizeNumericInput label="Save DC"
                                   inputValue={er.saveDC}
                                   changeFunc={setSaveDC}
                                   placeholder={8}/>: <div/>}
        {er.effectType !== "" ?
          <Select className="paddedDiv"
                  value={er.saveStat}
                  placeholder="Stat to save against this attack"
                  onChange={setSaveStat}
                  options={statOptions}/>: <div/>}
        {er.effectType !== "" ? <DynamicSizeNumericInput label="Save DC"/>: <div/>}
        <Button onClick={createEffect}/>
      </Grid.Column>
    </Grid>
  </div>
);

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
});

const mapDispatchToProps = (dispatch) => ({
  setEffectName: (e) => dispatch(actions.setEffectName(e.target.value)),
  changeEffectType: (e) => dispatch(actions.changeEffectType(e)),
  setSaveDC: (e) => dispatch(actions.setEffectSaveDC(e.target.value)),
  setSaveStat: (e) => dispatch(actions.setEffectSaveStat(e)),

  createEffect: () => dispatch(actions.createEffect()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container)
