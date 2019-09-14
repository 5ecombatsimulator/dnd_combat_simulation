import React  from 'react';
import { useSelector, useDispatch } from 'react-redux'
import "react-table/react-table.css";
import Select from 'react-select';
import * as actions from '../../actions/exploreActions'
import CombatantTable from '../../simulation/components/CombatantTable'
import '../../index.css';

import { Grid } from 'semantic-ui-react'

const TwoColumnGrid = ({col1Content, col2Content}) => (
  <div>
    <Grid>
      <Grid.Column className="eight wide">
        {col1Content}
      </Grid.Column>
      <Grid.Column className="eight wide">
        {col2Content}
      </Grid.Column>
    </Grid>
  </div>
);

const Stat = ({stat_label, stat_val}) => (
  <h5>{stat_label}: {stat_val}</h5>
)

const FullStatBox = ({str, dex, con, wis, int, cha}) => (
  <div className="ui raised segment">
    <Grid.Row>
      <TwoColumnGrid
        col1Content={<Stat stat_label="STR save" stat_val={str}/>}
        col2Content={<Stat stat_label="INT save" stat_val={int}/>}/>
    </Grid.Row>
    <Grid.Row>
      <TwoColumnGrid
        col1Content={<Stat stat_label="DEX save" stat_val={dex}/>}
        col2Content={<Stat stat_label="WIS save" stat_val={wis}/>}/>
    </Grid.Row>
    <Grid.Row>
      <TwoColumnGrid
        col1Content={<Stat stat_label="CON save" stat_val={con}/>}
        col2Content={<Stat stat_label="CHA save" stat_val={cha}/>}/>
    </Grid.Row>
  </div>
);

const ExtraStatBox = ({cr, prof, hp, ac}) => (
  <div className="ui raised segment">
    <TwoColumnGrid
        col1Content={<Stat stat_label="CR" stat_val={cr}/>}
        col2Content={<Stat stat_label="Proficiency" stat_val={prof}/>}/>
    <TwoColumnGrid
        col1Content={<Stat stat_label="HP" stat_val={hp}/>}
        col2Content={<Stat stat_label="AC" stat_val={ac}/>}/>
  </div>
);


const Action = ({actionName, actionDesc}) => (
  <div className="ui segment">
    <b>{actionName}: </b>{actionDesc}
  </div>
);

const ActionBox = ({actions}) => (
  <div className="ui segments left aligned" style={{textAlign: "left", backgroundColor: "white"}}>
    <div className="ui segment">
      <h4>Actions:</h4>
    </div>
    <div className="ui segments">
      {actions.map((a) => <Action actionName={a.name} actionDesc={a.description} key={actions.indexOf(a)}/>)}
    </div>
  </div>
);


const ExploreCombatantScreen = () => {
  let ec = useSelector(state => state.exploreCombatantReducer)

  const dispatch = useDispatch()
  const loadCombatant = c => dispatch(actions.loadCombatant(c))

  return (
    <div>
      <Grid columns="two" stackable>
        <Grid.Column>
          <Select options={ec.allCombatants}
                  value={ec.chosenCombatant}
                  placeholder="Choose a combatant"
                  onChange={loadCombatant}/>
          <CombatantTable onClickFunction={loadCombatant}/>
        </Grid.Column>
        <Grid.Column className="ui raised segment" style={{backgroundColor:"#f2f2f2"}}>
          <Grid.Row>
            <Grid columns="one">
              <Grid.Column className="ui raised segment centered ten wide">
                <i><h1>{ec.combatantName !== "" ? ec.combatantName : "Combatant Name..."}</h1></i>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <br/>
          <Grid.Row>
            <Grid columns="two" style={{textAlign: "left"}}>
              <Grid.Column>
                <FullStatBox str={ec.combatantStrength} dex={ec.combatantDexterity} con={ec.combatantConstitution}
                            wis={ec.combatantWisdom} int={ec.combatantIntelligence} cha={ec.combatantCharisma}/>
              </Grid.Column>
              <Grid.Column>
                <ExtraStatBox cr={ec.combatantCR} prof={ec.combatantProficiency}
                              hp={ec.combatantHP} ac={ec.combatantAC}/>
              </Grid.Column>
            </Grid>
          </Grid.Row>
          <br/>
          <Grid.Row>
            <ActionBox actions={ec.combatantActions}/>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default ExploreCombatantScreen