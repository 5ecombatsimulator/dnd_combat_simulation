import http from './post.js'
import postUrls from '../urls.js'

const SimulatorSource = {
  getCombatants: () => http(postUrls.getCombatants, 'GET'),
  getActions: () => http(postUrls.getActions, 'GET'),
  runSimulation: (team1, team2) => http(postUrls.runSimulation, 'POST', {team1, team2}),
  createCombatant: (name, hp, ac, proficiency, strength, constitution, dexterity, wisdom, intelligence, charisma, actions) =>
    http(postUrls.createCombatant, 'POST', {name, hp, ac, proficiency, strength, constitution, dexterity, wisdom, intelligence, charisma, actions})
}

export default SimulatorSource