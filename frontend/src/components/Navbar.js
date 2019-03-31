import React  from 'react';

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import {CrossedSwords, Magnifier, Flame, EditPerson, Flare, OpenBook} from "../assets/svgIcons";

const SideNavComponent = ({setCurrentTab}) => {
  return <SideNav
    style={{backgroundColor: "#2185d0"}}
    onSelect={(selected) => {setCurrentTab(selected)}}>
    <SideNav.Toggle/>
    <SideNav.Nav defaultSelected="Simulator">
      <NavItem eventKey="Simulator">
        <NavIcon>
          <CrossedSwords/>
        </NavIcon>
        <NavText>
          Simulator
        </NavText>
      </NavItem>
      <NavItem eventKey="CombatantCreation">
        <NavIcon>
          <EditPerson/>
        </NavIcon>
        <NavText>
          Create a combatant
        </NavText>
      </NavItem>
      <NavItem eventKey="actionCreation">
        <NavIcon>
          <Flame/>
        </NavIcon>
        <NavText>
          Action Creation
        </NavText>
        <NavItem eventKey="AttackAgainstAC">
          <NavText>
            Attack against AC
          </NavText>
        </NavItem>
        <NavItem eventKey="AttackWithSave">
          <NavText>
            Attack requiring save
          </NavText>
        </NavItem>
      </NavItem>
      <NavItem eventKey="EffectCreation">
        <NavIcon>
          <Flare/>
        </NavIcon>
        <NavText>
          Create an effect
        </NavText>
      </NavItem>
      <NavItem eventKey="exploration">
        <NavIcon>
          <Magnifier/>
        </NavIcon>
        <NavText>
          Explore
        </NavText>
        <NavItem eventKey="exploreCombatant">
          <NavText>
            Combatants
          </NavText>
        </NavItem>
      </NavItem>
      <NavItem eventKey="generalInfo">
        <NavIcon>
          <OpenBook/>
        </NavIcon>
        <NavText>
          Information
        </NavText>
      </NavItem>
    </SideNav.Nav>
  </SideNav>
}

export default SideNavComponent;