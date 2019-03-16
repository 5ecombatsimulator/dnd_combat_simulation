import React  from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import '../../index.css';

import {DynamicSizeNumericInput, DynamicSizeTextInput} from "../utils";
import { Button, Grid } from 'semantic-ui-react'
import * as actions from "../../actions/effectCreationActions";

const StunEffectCreationScreen = ({er}) => (
  <h1>STUN SCREEN</h1>
)

const mapStateToProps = (state) => ({
  er: state.effectCreationReducer,
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(StunEffectCreationScreen)
