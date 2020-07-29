import React from 'react'
import { useSelector } from 'react-redux'
import "../../styles/textStyles.css"

const columns = [
  {
    'avg_num_rounds': 'Average number of rounds',
    'perc_time_t1_won': 'Percent of times Team 1 won',
    'num_times_at_least_one_t1_death': 'Number of times at least one member from team 1 died',
  },
  {
    'avg_t1_deaths': 'Average number of team 1 deaths per fight',
    'avg_num_round_when_t1_won': 'Average number of rounds when Team 1 won',
    'avg_num_round_when_t2_won': 'Average number of rounds when Team 2 won'
  }
]

const ResultsScreen = () => {
  let results = useSelector(state => state.combatantSelectionReducer.simulationResults)

  return (
    <div>
      <div className="ui grid">
        {columns.map(column => (
          <div className="eight wide column">
            {Object.keys(column).map(k => <h5 style={{textAlign: 'left'}}>{column[k]}: {results[k]}</h5>)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsScreen