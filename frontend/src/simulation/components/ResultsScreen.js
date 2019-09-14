import React from 'react'
import { useSelector } from 'react-redux'

const columns = [
  {
    'avg_num_rounds': 'Average Number of Rounds',
    'perc_time_t1_won': 'Percent of times Team 1 won',
    'num_times_at_least_one_t1_death': 'Number of Times 1 Team 1 member died',
  },
  {
    'avg_t1_deaths': 'Average Number of Team 1 deaths',
    'avg_num_round_when_t1_won': 'Average Number of Rounds when Team 1 won',
    'avg_num_round_when_t2_won': 'Average Number of Rounds when Team 2 won'
  }
]

const ResultsScreen = () => {
  let results = useSelector(state => state.combatantSelectionReducer.simulationResults)

  return (
    <div>
      <div className="ui grid">
        {columns.map(column => (
          <div className="eight wide column">
            {Object.keys(column).map(k => <h4>{column[k]}: {results[k]}</h4>)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsScreen