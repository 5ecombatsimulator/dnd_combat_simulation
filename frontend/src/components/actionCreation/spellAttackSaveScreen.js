import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import "react-table/react-table.css";
import * as arActions from '../../actions/actionCreationActions'

import '../../index.css';

const statOptions = [
  {value: "STR", label: "Strength"},
  {value: "DEX", label: "Dexterity"},
  {value: "CON", label: "Constitution"},
  {value: "WIS", label: "Wisdom"},
  {value: "INT", label: "Intelligence"},
  {value: "CHA", label: "Charisma"}
];

const SpellAttackSaveScreen = ({ar, setActionName, setStatBonus, setDamageType,
                                 setDice, setBonusToHit, setBonusToDamage, setMultiAttack,
                                 setRechargePercentile, shiftIsLegendary, setLegendaryActionCost,
                                 setSaveStat, setSaveDC, shiftIsAoe, setAoeType, shiftDoesHalfDamageOnFailure,
                                 createAttackWithSave}) => (
  <div>
    <h2> Create a Spell Attack requiring a save with name: <input value={ar.actionName} placeholder="Action name" onChange={setActionName}/> </h2>
    <div className="ui grid">
      <div>
        <Select value={ar.damageType}
                placeholder={"Damage type of attack"}
                onChange={setDamageType}
                options={ar.damageTypeOptions}/>
        This spell does half damage on a failure: <input value={ar.doesHalfDamageOnFailure} onChange={shiftDoesHalfDamageOnFailure} type="checkbox"/>
        <input value={ar.dice} placeholder="Dice for attack" onChange={setDice}/>
        <Select value={ar.saveStat}
                placeholder="Stat to save against this attack"
                onChange={setSaveStat}
                options={statOptions}/>
        DC of the save: <input value={ar.saveDC} onChange={setSaveDC} type="number" min="8"/><br/>
        Multi-attack count: <input value={ar.multiAttack} onChange={setMultiAttack} placeholder="Number of multi-attacks" type="number" min="1"/><br/>
        Recharge percentile: <input value={ar.rechargePercentile} onChange={setRechargePercentile} placeholder="Recharge Percentile" type="number" min="0.0" step="0.01"/><br/>
        Does area-of-effect: <input value={ar.isAoe} onChange={shiftIsAoe} type="checkbox"/><br/>
        <Select value={ar.aoeType}
                placeholder={"What kind of area this attack effects"}
                onChange={setAoeType}
                options={ar.aoeTypeOptions}/>
        Is legendary: <input value={ar.isLegendary} onChange={shiftIsLegendary} placeholder="Is this a legendary action?" type="checkbox"/><br/>
        Legendary action cost (0 for non-legendary actions): <input value={ar.legendaryActionCost} onChange={setLegendaryActionCost} type="number" min="0"/><br/>
      </div>
      <div>

      </div>
    </div>
    <button className="button" onClick={createAttackWithSave} type="button">Create Action</button>
    <h5 style={{color:ar.actionCreationErrorMsg === "Success" ? "#007f00" : "#e50000"}}>{ar.actionCreationErrorMsg}</h5>
  </div>
)

class Container extends React.Component{
  constructor(props) {
    super(props);
    props.getDamageTypeOptions();
    props.getAoeOptions();
    props.resetActionCreationMsg();
    props.resetTabAttributes();
  }

  render() {
    return <SpellAttackSaveScreen {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  ar: state.actionCreationReducer,
});

const mapDispatchToProps = (dispatch) => ({
  getDamageTypeOptions: () => dispatch(arActions.getDamageTypeOptions()),
  getAoeOptions: () => dispatch(arActions.getAoeTypeOptions()),
  resetActionCreationMsg: () => dispatch(arActions.resetActionCreationErrorMsg()),

  setActionName: (e) => dispatch(arActions.setActionName(e.target.value)),
  setSaveStat: (e) => dispatch(arActions.setSaveStat(e)),
  setSaveDC: (e) => dispatch(arActions.setSaveDC(e.target.value)),
  shiftIsAoe: () => dispatch(arActions.shiftIsAoe()),
  setAoeType: (e) => dispatch(arActions.setAoeType(e)),
  setDamageType: (e) => dispatch(arActions.setDamageType(e)),
  setDice: (e) => dispatch(arActions.setDice(e.target.value)),
  setMultiAttack: (e) => dispatch(arActions.setMultiAttack(e.target.value)),
  setRechargePercentile: (e) => dispatch(arActions.setRechargePercentile(e.target.value)),
  setLegendaryActionCost: (e) => dispatch(arActions.setLegendaryActionCost(e.target.value)),
  shiftIsLegendary: () => dispatch(arActions.shiftIsLegendary()),
  shiftDoesHalfDamageOnFailure: () => dispatch(arActions.shiftDoesHalfDamageOnFailure()),
  createAttackWithSave: () => dispatch(arActions.createAction("AttackWithSave")),
  resetTabAttributes: () => dispatch(arActions.resetTabAttributes())
});

export default connect(mapStateToProps, mapDispatchToProps)(Container)