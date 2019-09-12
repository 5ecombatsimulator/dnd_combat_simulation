import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import '../../index.css';

import { Button, Input, Grid } from 'semantic-ui-react'

const GeneralInfoScreen = ({}) => (
  <Grid stackable>
    <div className="row">
      <div className="eight wide column">
      </div>
      <div className="eight wide column">
      </div>
    </div>

    <div className="row">
      <div className="five wide column">
      </div>
      <div className="six wide column">
      </div>
      <div className="five wide column">
      </div>
    </div>
  </Grid>
)

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInfoScreen)