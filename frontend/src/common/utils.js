/**
 * Created by Andrew on 1/17/18.
 */

export const setterReducer = (initialState, actionType, key) => (state = initialState, action) => {
  switch(action.type) {
    case actionType:
      if (key)
        return action.payload[key]
      return action.payload
    default:
      return state
  }
}

export const counterReducer = (actionType) => (state=0, action) => {
  switch(action.type) {
    case actionType:
      return state + 1
    default:
      return state
  }
}

export const listReducer = (setAction, addAction) => (state=[], action) => {
  switch(action.type) {
    case setAction:
      return action.payload
    case addAction:
      return [...state, action.payload]
    default:
      return state
  }
}

/*
* Helper method pulled from the redux documentation "Reducing boilerplate"
* This creates an action of type 'type' and using all remaining arguments
* as arguments in the function returned that get mapped to keys in the action
* created when the returned function is called.
* ex: createAction('SET_ITEM', 'item') generates a function equivalent to
* (item) => ({type: 'SET_ITEM', item: item})
*/
export const createAction = (type, ...argNames) => {
  return function(...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

// Generates an action creator that takes one argument passed as 'payload'
export const simpleAction = (type) => createAction(type, 'payload')