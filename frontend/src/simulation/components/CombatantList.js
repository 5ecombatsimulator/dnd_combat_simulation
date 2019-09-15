import React from 'react'

export default function CombatantList({team, onQuantityChange, onDelete}) {
  return (
    <div>
      {Object.keys(team).map(combatant => (
        <div>
          {combatant}: <input type="number"
            value={team[combatant].quantity}
            onInput={(e) => onQuantityChange(combatant, e.target.value)}
          />
          <button onClick={() => onDelete(combatant)}>x</button>
        </div>
      ))}
    </div>
  )
}