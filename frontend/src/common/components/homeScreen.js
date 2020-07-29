import React, {useState} from 'react'
import "react-tabs/style/react-tabs.css"
import '../../index.css'
import { Sidenav, Nav, Toggle, Dropdown, Icon } from 'rsuite';
import 'rsuite/lib/styles/index.less';
import 'rsuite/dist/styles/rsuite-default.css';

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

class SideNavAndBody extends React.Component {
    constructor() {
      super();
      this.state = {
        expanded: true,
        activeKey: '1'
      };
      this.handleToggle = this.handleToggle.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
    }
    handleToggle() {
      this.setState({
        expanded: !this.state.expanded
      });
    }
    handleSelect(eventKey) {
      this.setState({
        activeKey: eventKey
      });
    }
    render() {
      const { expanded } = this.state;

      return (
        <div style={{ width: 250 }}>
          <Toggle onChange={this.handleToggle} checked={expanded} />
          <hr />
          <Sidenav
            expanded={expanded}
            defaultOpenKeys={['3', '4']}
            activeKey={this.state.activeKey}
            onSelect={this.handleSelect}
          >
            <Sidenav.Body>
              <Nav>
                <Nav.Item eventKey="1" icon={<Icon icon="dashboard" />}>
                  Dashboard
                </Nav.Item>
                <Nav.Item eventKey="2" icon={<Icon icon="group" />}>
                  User Group
                </Nav.Item>
                <Dropdown
                  placement="rightStart"
                  eventKey="3"
                  title="Advanced"
                  icon={<Icon icon="magic" />}
                >
                  <Dropdown.Item eventKey="3-1">Geo</Dropdown.Item>
                  <Dropdown.Item eventKey="3-2">Devices</Dropdown.Item>
                  <Dropdown.Item eventKey="3-3">Loyalty</Dropdown.Item>
                  <Dropdown.Item eventKey="3-4">Visit Depth</Dropdown.Item>
                </Dropdown>
                <Dropdown
                  placement="rightStart"
                  eventKey="4"
                  title="Settings"
                  icon={<Icon icon="gear-circle" />}
                >
                  <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
                  <Dropdown.Item eventKey="4-2">Channels</Dropdown.Item>
                  <Dropdown.Item eventKey="4-3">Versions</Dropdown.Item>
                  <Dropdown.Menu eventKey="4-5" title="Custom Action">
                    <Dropdown.Item eventKey="4-5-1">Action Name</Dropdown.Item>
                    <Dropdown.Item eventKey="4-5-2">Action Params</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>
      );
    }
  }

export default function HomeScreen (props) {
  //return <Demo/>
  const [currentTab, setCurrentTab] = useState("Simulator")
  const RenderedContent = tabs[currentTab]
  
  return (
    <body>
      <SidebarNav setCurrentTab={setCurrentTab}/>
      <Grid stackable>
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