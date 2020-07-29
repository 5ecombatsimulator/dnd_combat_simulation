import React, {useState} from 'react'
import "react-tabs/style/react-tabs.css"
import '../../index.css'

import SimulatorScreen from '../../simulation/components/SimulatorScreen'
import CombatantCreationScreen from '../../combatantCreation/components/combatantCreationScreen'
import AttackAgainstACCreationScreen from '../../actionCreation/components/attackAgainstACScreen'
import SpellAttackWithSaveCreationScreen from '../../actionCreation/components/spellAttackSaveScreen'
import EffectCreationScreen from '../../effectCreation/components/effectCreationScreen'
import ExploreCombatantScreen from '../../exploreCombatants/components/exploreCombatant'
import InfoPage from '../../informationPage/components/informationPageReact'
import SidebarNav from '../../nav/components/Navbar'

import {Grid} from 'semantic-ui-react'

const tabs = {
  "Simulator": SimulatorScreen,
  "CombatantCreation": CombatantCreationScreen,
  "AttackAgainstAC": AttackAgainstACCreationScreen,
  "AttackWithSave": SpellAttackWithSaveCreationScreen,
  "EffectCreation": EffectCreationScreen,
  "exploreCombatant": ExploreCombatantScreen,
  "generalInfo": InfoPage,
}

export default function HomeScreen (props) {
  const [currentTab, setCurrentTab] = useState("Simulator")
  const RenderedContent = tabs[currentTab]
  
  return (
    <body>
      <SidebarNav setCurrentTab={setCurrentTab}/>
      <Grid stackable style={{marginTop: 40}}>
        <Grid.Row>
          <div className="one wide column"/>
          <div className="fourteen wide column">
            <RenderedContent tabName={currentTab} />
          </div>
          <div className="one wide column"/>
        </Grid.Row>
      </Grid>
    </body>
  )

}