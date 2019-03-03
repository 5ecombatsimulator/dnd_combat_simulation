import React, { Component } from 'react';
import '../styles/paddingStyles.css'
import {Popup} from 'semantic-ui-react'

export const ConditionalComponent = ({condition, component}) => {
  if (condition) {
    return component
  }
  else {
    return <div/>
  }
}

export const DynamicSizeTextInput = ({labelValue, inputValue, changeFunc, placeholderValue, tooltip=null}) => {
  let label = (<div className="ui label">{labelValue}</div>);
  return (
    <div className='ui fluid labeled input paddedDiv'>
      {/* Use just the label if there is no tooltip */}
      {tooltip !== null ? <Popup trigger={label} wide>{tooltip}</Popup> : label}
      <input value={inputValue}
             onChange={changeFunc}
             placeholder={placeholderValue}/>
    </div>
  )
};

export const DynamicSizeNumericInput = ({labelValue, inputValue, changeFunc, minValue, stepSize=1, tooltip=null}) => {
  let label = (<div className="ui label">{labelValue}</div>);
  return (
    <div className='ui fluid labeled input paddedDiv'>
      {/* Use just the label if there is no tooltip */}
      {tooltip !== null ? <Popup trigger={label} wide>{tooltip}</Popup> : label}
      <input value={inputValue}
             onChange={changeFunc}
             type="number" min={minValue} step={stepSize}/>
    </div>
  )
};


export const ToggleWithLabel = ({inputValue, changeFunc, labelValue, tooltip=null}) => {
  let label = (<div className="ui label"><h5>{labelValue}</h5></div>);
  return (
    <div className="paddedDiv">
      {/* Use just the label if there is no tooltip */}
      {tooltip !== null ? <Popup trigger={label} wide>{tooltip}</Popup> : label}
      <div className="ui toggle checkbox" style={{verticalAlign: "middle"}}>
        <input type="checkbox"
               value={inputValue}
               onChange={changeFunc}/>
          <label/>
      </div>
    </div>
  )
}

export const statOptions = [
  {value: "STR", label: "Strength"},
  {value: "DEX", label: "Dexterity"},
  {value: "CON", label: "Constitution"},
  {value: "WIS", label: "Wisdom"},
  {value: "INT", label: "Intelligence"},
  {value: "CHA", label: "Charisma"}
];