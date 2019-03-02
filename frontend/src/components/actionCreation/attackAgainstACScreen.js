import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import "react-table/react-table.css";
import * as arActions from '../../actions/actionCreationActions'

import { Button } from 'semantic-ui-react'

import '../../index.css';

const statOptions = [
  {value: "STR", label: "Strength"},
  {value: "DEX", label: "Dexterity"},
  {value: "CON", label: "Constitution"},
  {value: "WIS", label: "Wisdom"},
  {value: "INT", label: "Intelligence"},
  {value: "CHA", label: "Charisma"}
];

const AttackAgainstACScreen = ({ar, setActionName, setStatBonus, setDamageType,
                                setDice, setBonusToHit, setBonusToDamage, setMultiAttack,
                                setRechargePercentile, shiftIsLegendary, setLegendaryActionCost,
                                setSpellOrAttack,
                                createAttackAgainstAC}) => (
  <div>
    <h2> Create an Attack that checks against target's AC with name: <input value={ar.actionName} placeholder="Action name" onChange={setActionName}/> </h2>
    <div className="ui grid">
      <div className="row">
        <div>
          <label htmlFor="spellOrAttack">Attack</label>
          <input type="radio" name="spellOrAttack" id="Attack" value="Attack" onChange={setSpellOrAttack}/>
          <label htmlFor="spellOrAttack">Spell</label>
          <input type="radio" name="spellOrAttack" id="Spell" value="Spell" onChange={setSpellOrAttack}/>
        </div>
        <Select value={ar.damageType}
                placeholder={"Damage type of attack"}
                onChange={setDamageType}
                options={ar.damageTypeOptions}/>
        <input className="HalfWidthInput" value={ar.dice} placeholder="Dice for attack" onChange={setDice}/>
        <Select value={ar.statBonus}
                placeholder="Stat bonus for attack"
                onChange={setStatBonus}
                options={statOptions}/>
        <div className="row">
          <div>
            <label>Bonus to hit:</label>
            <input className="HalfWidthInput" value={ar.bonusToHit} onChange={setBonusToHit} placeholder="Bonus to hit" type="number" min="0"/><br/>
            <label>Multi-attack count:</label>
            <input className="HalfWidthInput" value={ar.multiAttack} onChange={setMultiAttack} placeholder="Number of multi-attacks" type="number" min="1"/><br/>
            <label>Is legendary:</label>
            <input value={ar.isLegendary} onChange={shiftIsLegendary} placeholder="Is this a legendary action?" type="checkbox"/><br/>
            <label>Bonus to damage:</label>
            <input className="HalfWidthInput" value={ar.bonusToDamage} onChange={setBonusToDamage} placeholder="Bonus to damage" type="number" min="0"/><br/>
            <label>Recharge percentile:</label>
            <input className="HalfWidthInput" value={ar.rechargePercentile} onChange={setRechargePercentile} placeholder="Recharge Percentile" type="number" min="0.0" step="0.01"/><br/>
            <label>Legendary action cost (0 for non-legendary actions):</label>
            <input className="HalfWidthInput" value={ar.legendaryActionCost} onChange={setLegendaryActionCost} type="number" min="0"/><br/>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
    <Button content='Create Action' primary onClick={createAttackAgainstAC}/>
  </div>
)

class Container extends React.Component{
  constructor(props) {
    super(props);
    props.getDamageTypeOptions();
    props.resetActionCreationMsg();
    props.resetTabAttributes();
  }

  render() {
    return <AttackAgainstACScreen {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  ar: state.actionCreationReducer,
});

const mapDispatchToProps = (dispatch) => ({
  getDamageTypeOptions: () => dispatch(arActions.getDamageTypeOptions()),
  resetActionCreationMsg: () => dispatch(arActions.resetActionCreationErrorMsg()),

  setActionName: (e) => dispatch(arActions.setActionName(e.target.value)),
  setStatBonus: (e) => dispatch(arActions.setStatBonus(e)),
  setDamageType: (e) => dispatch(arActions.setDamageType(e)),
  setDice: (e) => dispatch(arActions.setDice(e.target.value)),
  setBonusToDamage: (e) => dispatch(arActions.setBonusToDamage(e.target.value)),
  setBonusToHit: (e) => dispatch(arActions.setBonusToHit(e.target.value)),
  setMultiAttack: (e) => dispatch(arActions.setMultiAttack(e.target.value)),
  setRechargePercentile: (e) => dispatch(arActions.setRechargePercentile(e.target.value)),
  setSpellOrAttack: (e) => dispatch(arActions.setSpellOrAttack(e.target.value)),
  setLegendaryActionCost: (e) => dispatch(arActions.setLegendaryActionCost(e.target.value)),
  shiftIsLegendary: () => dispatch(arActions.shiftIsLegendary()),
  createAttackAgainstAC: () => dispatch(arActions.createAction("AttackAgainstAC")),
  resetTabAttributes: () => dispatch(arActions.resetTabAttributes())
});

export default connect(mapStateToProps, mapDispatchToProps)(Container)