import React from 'react';
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'

import {DynamicSizeNumericInput, DynamicSizeTextInput, statOptions} from "../../common/components/utils"
import { Button, Grid } from 'semantic-ui-react'
import * as actions from "../actions"

const ShowDamageDice = ({effectType}) => {
  return effectType === "DOT Effect"
}

const EffectCreationScreen = () => {
  let er = useSelector(state => state.effectCreationReducer)

  const dispatch = useDispatch()
  if (er.allEffectTypes.length < 1)
    dispatch(actions.getAndSetEffectTypes())

  const setEffectName = (e) => dispatch(actions.setEffectName(e.target.value))
  const changeEffectType = (e) => dispatch(actions.changeEffectType(e))
  const setSaveDC = (e) => dispatch(actions.setEffectSaveDC(e.target.value))
  const setSaveStat = (e) => dispatch(actions.setEffectSaveStat(e))
  const setDamageDice = (e) => dispatch(actions.setEffectDamageDice(e.target.value))
  const setNumTurns = (e) => dispatch(actions.setEffectNumTurns(e.target.value))
  const createEffect = () => dispatch(actions.createEffect())

  return (
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
  )
}

export default EffectCreationScreen
