import React, {useState, useEffect}  from 'react';

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
      'exploreCombatant': {text: 'Combatants'}
    }
  },
  'generalInfo': {icon: OpenBook, text: 'Information'}
}

const Icon = ({icon}) => {
  const I = icon
  return <I />
}

const SideNavComponent = ({setCurrentTab}) => {
  let navStyleBase = {backgroundColor: "#2185d0", position: 'fixed'}

  const [expanded, setExpanded] = useState(false)
  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })
  const handleToggle = (e) => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    

    window.addEventListener('resize', handleResize)
  })

  return <SideNav
    style={dimensions.width > 480 || expanded ? navStyleBase : {...navStyleBase, bottom: dimensions.height - 64}}
    expanded={expanded}
    onToggle={handleToggle}
    onSelect={(selected) => {setCurrentTab(selected)}}>
    <SideNav.Toggle/>
    <SideNav.Nav defaultSelected="Simulator">
      {window.innerWidth <= 480 && !expanded ? <span /> : Object.keys(tabs).map(tab => (
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