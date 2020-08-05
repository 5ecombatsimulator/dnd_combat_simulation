import React from 'react'
import { useSelector } from 'react-redux'
import "../../styles/textStyles.css"

const columns = [
  {
    'avg_num_rounds': {display: 'Average number of rounds'},
    'perc_time_t1_won': {display: 'Percent of times Team 1 won', percent: true},
    'num_times_at_least_one_t1_death': {display: 'Number of times at least one member from team 1 died'},
  },
  {
    'avg_t1_deaths': {display: 'Average number of team 1 deaths per fight'},
    'avg_num_round_when_t1_won': {display: 'Average number of rounds when Team 1 won'},
    'avg_num_round_when_t2_won': {display: 'Average number of rounds when Team 2 won'},
  }
]

const resultToPercent = (r) => {
  let percent = parseFloat(r) * 100
  percent = percent.toFixed(2).toString() // round to 2 decimal places and convert to string
  if (percent === 'NaN') {
    percent = '0.00'
  }
  return percent + '%'
}

const ResultsScreen = () => {
  let results = useSelector(state => state.combatantSelectionReducer.simulationResults)

  return (
    <div>
      <div className="ui grid">
        {columns.map(column => (
          <div className="eight wide column">
            {Object.keys(column).map(k => <h5 style={{textAlign: 'left'}}>{column[k].display}: {column[k].percent ? resultToPercent(results[k]) : results[k]}</h5>)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsScreen