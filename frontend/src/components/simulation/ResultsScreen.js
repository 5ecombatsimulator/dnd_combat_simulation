import React, { Component } from 'react';
import { connect } from 'react-redux'
import Grid from 'react-css-grid';
import '../../index.css';

const ResultsScreen = ({results}) => (
  <div>
    <Grid width={320} gap={32}>
      <div className="section">
        <h4>Average Number of Rounds: {results.avg_num_rounds}</h4>
        <h4>Percent of times Team 1 won: {results.perc_time_t1_won}</h4>
        <h4>Number of Times at least 1 Team 1 member died: {results.num_times_at_least_one_t1_death}</h4>
      </div>
      <div className="section">
        <h4>Average Number of Team 1 deaths: {results.avg_t1_deaths}</h4>
        <h4>Average Number of Rounds when Team 1 won: {results.avg_num_round_when_t1_won}</h4>
        <h4>Average Number of Rounds when Team 2 won: {results.avg_num_round_when_t2_won}</h4>
      </div>
    </Grid>
  </div>
)

const mapStateToProps = (state) => ({
  results: state.combatantSelectionReducer.simulationResults,
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultsScreen)