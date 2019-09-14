import React  from 'react';

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

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
      'exploreCombatant': 'Combatants'
    }
  },
  'generalInfo': {icon: OpenBook, text: 'Information'}
}

const Icon = ({icon}) => {
  const I = icon
  return <I />
}

const SideNavComponent = ({setCurrentTab}) => {
  return <SideNav
    style={{backgroundColor: "#2185d0"}}
    onSelect={(selected) => {setCurrentTab(selected)}}>
    <SideNav.Toggle/>
    <SideNav.Nav defaultSelected="Simulator">
      {Object.keys(tabs).map(tab => (
        <NavItem eventKey={tab}>
          {tabs[tab].icon ? <NavIcon>
            <Icon icon={tabs[tab].icon} />
          </NavIcon> : <span />}
          <NavText>{tabs[tab].text}</NavText>
          {tabs[tab].children ? Object.keys(tabs[tab].children).map(child => (
            <NavItem eventKey={child}>
              <NavText>{tabs[tab].children[child].text}</NavText>
            </NavItem>
          )): <span />}
        </NavItem>
      ))}
    </SideNav.Nav>
  </SideNav>
}

export default SideNavComponent