import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import "react-table/react-table.css";
import * as arActions from '../../actions/actionCreationActions'

import Grid from 'react-css-grid';
import '../../index.css';

const statOptions = [
  {value: "STR", label: "Strength"},
  {value: "DEX", label: "Dexterity"},
  {value: "CON", label: "Constitution"},
  {value: "WIS", label: "Wisdom"},
  {value: "INT", label: "Intelligence"},
  {value: "CHA", label: "Charisma"}
];

const PhysicalAttackCreation = ({ar, setActionName, setStatBonus, setDamageType,
                                setDice, setBonusToHit, setBonusToDamage, setMultiAttack,
                                setRechargePercentile, shiftIsLegendary, setLegendaryActionCost,
                                createPhysicalAttackAction}) => (
  <div>
    <h2> Create a Physical Attack with name: <input value={ar.actionName} placeholder="Action name" onChange={setActionName}/> </h2>
    <Grid width={160} gap={16}>
      <div>
        <Select value={ar.damageType}
                placeholder={"Damage type of attack"}
                onChange={setDamageType}
                options={ar.damageTypeOptions}/>
        <input value={ar.dice} placeholder="Dice for attack" onChange={setDice}/>
        <Select value={ar.statBonus}
                placeholder="Stat bonus for attack"
                onChange={setStatBonus}
                options={statOptions}/>
        Bonus to hit: <input value={ar.bonusToHit} onChange={setBonusToHit} placeholder="Bonus to hit" type="number" min="0"/><br/>
        Bonus to damage: <input value={ar.bonusToDamage} onChange={setBonusToDamage} placeholder="Bonus to damage" type="number" min="0"/><br/>
        Multi-attack count: <input value={ar.multiAttack} onChange={setMultiAttack} placeholder="Number of multi-attacks" type="number" min="1"/><br/>
        Recharge percentile: <input value={ar.rechargePercentile} onChange={setRechargePercentile} placeholder="Recharge Percentile" type="number" min="0.0" step="0.01"/><br/>
        Is legendary: <input value={ar.isLegendary} onChange={shiftIsLegendary} placeholder="Is this a legendary action?" type="checkbox"/><br/>
        Legendary action cost (0 for non-legendary actions): <input value={ar.legendaryActionCost} onChange={setLegendaryActionCost} type="number" min="0"/><br/>
      </div>
      <div>

      </div>
    </Grid>
    <button className="button" onClick={createPhysicalAttackAction} type="button">Create Action</button>
  </div>
)

class Container extends React.Component{
  constructor(props) {
    super(props);
    props.getDamageTypeOptions();
  }

  render() {
    return <PhysicalAttackCreation {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  ar: state.actionCreationReducer,
});

const mapDispatchToProps = (dispatch) => ({
  getDamageTypeOptions: () => dispatch(arActions.getDamageTypeOptions()),
  setActionName: (e) => dispatch(arActions.setActionName(e.target.value)),
  setStatBonus: (e) => dispatch(arActions.setStatBonus(e)),
  setDamageType: (e) => dispatch(arActions.setDamageType(e)),
  setDice: (e) => dispatch(arActions.setDice(e.target.value)),
  setBonusToDamage: (e) => dispatch(arActions.setBonusToDamage(e.target.value)),
  setBonusToHit: (e) => dispatch(arActions.setBonusToHit(e.target.value)),
  setMultiAttack: (e) => dispatch(arActions.setMultiAttack(e.target.value)),
  setRechargePercentile: (e) => dispatch(arActions.setRechargePercentile(e.target.value)),
  setLegendaryActionCost: (e) => dispatch(arActions.setLegendaryActionCost(e.target.value)),
  shiftIsLegendary: () => dispatch(arActions.shiftIsLegendary()),
  createPhysicalAttackAction: () => dispatch(arActions.createAction("PhysicalSingleAttack")),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container)