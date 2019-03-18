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
                                setSaveDC, setSaveStat, setDamageDice, setNumTurns}) => (
  <div>
    <h1> Create an effect: </h1>
    <Grid columns="three">
      <Grid.Column class="three wide"/>
      <Grid.Column class="ten wide">
        <DynamicSizeTextInput labelValue="Name"
                              inputValue={er.effectName}
                              changeFunc={setEffectName}
                              placeholderValue="Name..."/>
        <Select className="paddedDiv"
                  value={er.effectType}
                  placeholder={"Effect type"}
                  onChange={changeEffectType}
                  options={er.allEffectTypes}

        />
        {ShowDamageDice(er.effectType ?
          <DynamicSizeTextInput labelValue="Dice rolled for damage"
                                inputValue={er.damageDice}
                                changeFunc={setDamageDice}
                                placeholder="24d10"/>: <div/>)}
        {er.effectType !== "" ?
          <DynamicSizeNumericInput labelValue="Save DC"
                                   inputValue={er.saveDC}
                                   changeFunc={setSaveDC}
                                   placeholder={8}/>: <div/>}
        {er.effectType !== "" ?
          <DynamicSizeNumericInput labelValue="Lasts X turns:"
                                   inputValue={er.numTurns}
                                   changeFunc={setNumTurns}
                                   placeholder={10}/>: <div/>}
        {er.effectType !== "" ?
          <Select className="paddedDiv"
                  value={er.saveStat}
                  placeholder="Stat to save against this attack"
                  onChange={setSaveStat}
                  options={statOptions}/>: <div/>}
        <Button onClick={createEffect} content='Create Effect' primary/>
      </Grid.Column>
      <Grid.Column class="three wide"/>
    </Grid>
  </div>
);

class Container extends React.Component{
  constructor(props) {
    super(props);
    actions.getAndSetEffectTypes();
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
  setDamageDice: (e) => dispatch(actions.setEffectDamageDice(e.target.value)),
  setNumTurns: (e) => dispatch(actions.setEffectNumTurns(e.target.value)),

  createEffect: () => dispatch(actions.createEffect()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container)
