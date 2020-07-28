import React  from 'react';

import { Sidenav, Nav } from 'rsuite';
import 'rsuite/lib/styles/index.less';

import {CrossedSwords, Magnifier, Flame, EditPerson, Flare, OpenBook} from "../../assets/svgIcons";

const tabs = {
  'Simulator': {icon: CrossedSwords, text: 'Simulator'},
  'CombatantCreation': {icon: EditPerson, text: 'Create a combatant'},
  'actionCreation': {icon: Flame, text: 'Action Creation', children: {
      'AttackAgainstAC': {text: 'Attack against AC'},
      'AttackWithSave': {text: 'Attack requiring save'}
    }
  },
  'EffectCreation': {icon: Flare, text: 'Create an effect'},
  'exploration': {icon: Magnifier, text: 'Explore', children: {
      'exploreCombatant': {text: 'Combatants'}
    }
  },
  'generalInfo': {icon: OpenBook, text: 'Information'}
}

const Icon = ({icon}) => {
  const I = icon
  return <I />
}

{/*<SideNav.Toggle/>*/}
    {/*<SideNav.Nav defaultSelected="Simulator">*/}
      {/*{Object.keys(tabs).map(tab => (*/}
        {/*<NavItem eventKey={tab}>*/}
          {/*{tabs[tab].icon ? <NavIcon>*/}
            {/*<Icon icon={tabs[tab].icon} />*/}
          {/*</NavIcon> : <span />}*/}
          {/*<NavText>{tabs[tab].text}</NavText>*/}
          {/*{tabs[tab].children ? Object.keys(tabs[tab].children).map(child => (*/}
            {/*<NavItem eventKey={child}>*/}
              {/*<NavText>{tabs[tab].children[child].text}</NavText>*/}
            {/*</NavItem>*/}
          {/*)): <span />}*/}
        {/*</NavItem>*/}
      {/*))}*/}
    {/*</SideNav.Nav>*/}



const SideNavComponent = ({setCurrentTab}) => {
  return <Sidenav
    onSelect={(selected) => {setCurrentTab(selected)}}>
    <Sidenav.Body>
      <Nav>
        <Nav.Item eventKey="1" icon={<Icon icon="dashboard" />}>
            Dashboard
        </Nav.Item>
      </Nav>
    </Sidenav.Body>
  </Sidenav>
}

export default SideNavComponent