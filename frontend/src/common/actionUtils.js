const get = (sourceFunc, action, key) => (...args) => (dispatch) => {
  sourceFunc(...args).then((res) => {
    let data = key ? res.data[key] : res.data;
    dispatch(action(data))
  })
}

export {get as default}
