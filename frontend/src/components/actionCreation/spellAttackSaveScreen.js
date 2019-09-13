import React, { Component } from 'react'
import Select from 'react-select'
import { connect, useSelector, useDispatch } from 'react-redux'
import "react-table/react-table.css"
import * as arActions from '../../actions/actionCreationActions'

import {DynamicSizeNumericInput, DynamicSizeTextInput, ToggleWithLabel, ConditionalComponent, statOptions} from "../utils"
import EffectTable from './effectTable'
import { Button, Grid } from 'semantic-ui-react'

const SpellAttackSaveScreen = () => {
  const ar = useSelector(state => state.actionCreationReducer)

  const dispatch = useDispatch()
  if (ar.damageTypeOptions.length < 1) {
    dispatch(arActions.getDamageTypeOptions())
    dispatch(arActions.getAoeTypeOptions())
    dispatch(arActions.resetActionCreationErrorMsg())
    dispatch(arActions.resetTabAttributes())
  }

  const setActionName = (e) => dispatch(arActions.setActionName(e.target.value))
  const setSaveStat = (e) => dispatch(arActions.setSaveStat(e))
  const setSaveDC = (e) => dispatch(arActions.setSaveDC(e.target.value))
  const shiftIsAoe = () => dispatch(arActions.shiftIsAoe())
  const setAoeType = (e) => dispatch(arActions.setAoeType(e))
  const setDamageType = (e) => dispatch(arActions.setDamageType(e))
  const setDice = (e) => dispatch(arActions.setDice(e.target.value))
  const setMultiAttack = (e) => dispatch(arActions.setMultiAttack(e.target.value))
  const setRechargePercentile = (e) => dispatch(arActions.setRechargePercentile(e.target.value))
  const setLegendaryActionCost = (e) => dispatch(arActions.setLegendaryActionCost(e.target.value))
  const shiftIsLegendary = () => dispatch(arActions.shiftIsLegendary())
  const shiftDoesHalfDamageOnFailure = () => dispatch(arActions.shiftDoesHalfDamageOnFailure())
  const createAttackWithSave = () => dispatch(arActions.createAction("AttackWithSave"))
  const addEffect = (e) => dispatch(arActions.addActionEffect(e))
  const updateActionEffects = (newSet) => dispatch(arActions.updateActionEffects(newSet))

  return (
    <div>
      <Grid columns="two" divided stackable>
        <Grid.Column>
          <Grid.Row>
            <h3>Action attributes</h3>
            <DynamicSizeTextInput labelValue="Attack requiring save name:"
                                  inputValue={ar.actionName}
                                  placeholderValue="Super cool action name"
                                  changeFunc={setActionName}/>
            <Select className="paddedDiv"
                    value={ar.damageType}
                    placeholder={"Damage type of attack"}
                    onChange={setDamageType}
                    options={ar.damageTypeOptions}/>
            <Select className="paddedDiv"
                    value={ar.saveStat}
                    placeholder="Stat to save against this attack"
                    onChange={setSaveStat}
                    options={statOptions}/>
            <DynamicSizeTextInput labelValue="Dice for damage"
                                  inputValue={ar.dice}
                                  placeholderValue="100d6"
                                  changeFunc={setDice}
                                  tooltip={"The damage this attack does. Can be put in as 5d6 or with a plus between dice types such as 3d6+1d8"}/>
            <DynamicSizeNumericInput inputValue={ar.saveDC}
                                    changeFunc={setSaveDC}
                                    minValue="8"
                                    labelValue="DC of the save:"
                                    tooltip={"The save DC of the attack."}/>
            <DynamicSizeNumericInput inputValue={ar.multiAttack}
                                    changeFunc={setMultiAttack}
                                    labelValue="Multi-attack count:"
                                    minValue="1"
                                    tooltip={"If this attack should be performed multiple times per use. Scorching ray is an example of a 3 multi attack action."}/>
            <DynamicSizeNumericInput inputValue={ar.rechargePercentile}
                                    changeFunc={setRechargePercentile}
                                    labelValue="Recharge percentile"
                                    minValue="0.0" stepSize="0.01"
                                    tooltip={"The percentile the user has to roll higher than to recharge the attack. " +
                                    "A value of 0.0 means the attack is always available, while a 0.667 value would be equivalent to recharge on 5 or 6."}/>
            <ToggleWithLabel inputValue={ar.doesHalfDamageOnFailure}
                            changeFunc={shiftDoesHalfDamageOnFailure}
                            labelValue="This attack does half damage on a failed save"/>
            <ToggleWithLabel inputValue={ar.isAoe}
                            changeFunc={shiftIsAoe}
                            labelValue="This attack has an area-of-effect"/>
            <ConditionalComponent
              condition={ar.isAoe}
              component={<Select value={ar.aoeType}
                                placeholder={"What kind of area this attack effects"}
                                onChange={setAoeType}
                                options={ar.aoeTypeOptions}/>}
            />
            <ToggleWithLabel inputValue={ar.isLegendary}
                            changeFunc={shiftIsLegendary}
                            labelValue="This attack is a legendary action"/>
            <ConditionalComponent
              condition={ar.isLegendary}
              component={<DynamicSizeNumericInput inputValue={ar.legendaryActionCost}
                                    changeFunc={setLegendaryActionCost}
                                    minValue="0"
                                    labelValue="Legendary action cost"/>}
            />
          </Grid.Row>
        </Grid.Column>
        <Grid.Column>
          <h3>Action effects</h3>
          <Select
              closeOnSelect={false}
              isMulti
              onChange={updateActionEffects}
              options={ar.allEffects}
              placeholder="Add the effects of the action"
              removeSelected={true}
              value={ar.actionEffects}
            />
          <EffectTable addEffectFunction={addEffect}/>
        </Grid.Column>
      </Grid>
      <br/>
      <Button content='Create Action' primary onClick={createAttackWithSave}/>
      <h5 style={{color:ar.actionCreationErrorMsg === "Success" ? "#007f00" : "#e50000"}}>{ar.actionCreationErrorMsg}</h5>
    </div>
  )
}

export default SpellAttackSaveScreen