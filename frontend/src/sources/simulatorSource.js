import http from './post.js'
import postUrls from '../urls.js'

const SimulatorSource = {
  getCombatants: () => http(postUrls.getCombatants, 'GET'),
  getActions: () => http(postUrls.getActions, 'GET'),
  getEffects: () => http(postUrls.getEffects, 'GET'),
  getDamageTypes: () => http(postUrls.getDamageTypes, 'GET'),
  getAoeTypes: () => http(postUrls.getAoeTypes, 'GET'),
  runSimulation: (team1, team2) => http(postUrls.runSimulation, 'POST', {team1, team2}),
  createCombatant: (name, hp, ac, proficiency, strength, constitution, dexterity, wisdom, intelligence, charisma, actions) =>
    http(postUrls.createCombatant, 'POST', {name, hp, ac, proficiency, strength, constitution, dexterity, wisdom, intelligence, charisma, actions}),
  saveBattle: (team1, team2) => http(postUrls.saveBattle, 'POST', {team1, team2}),
  loadBattle: (battle_key) => http(postUrls.loadBattle, 'POST', {battle_key}),
  createAction: (name, action_type, stat_bonus, damage_type, bonus_to_hit, bonus_to_damage, multi_attack, recharge_percentile, is_legendary, legendary_action_cost, save_stat, save_dc, is_aoe, aoe_type, dice) =>
    http(postUrls.createAction, 'POST', {name, action_type, stat_bonus, damage_type, bonus_to_hit, bonus_to_damage, multi_attack, recharge_percentile, is_legendary, legendary_action_cost, save_stat, save_dc, is_aoe, aoe_type, dice}),
}

export default SimulatorSource