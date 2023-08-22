
const state = {
  row: JSON.parse(localStorage.getItem('row')) || ''
}
const mutations = {
  SETTING_PRE (state, params) {
    state.row = params
  }
}
const actions = {
  setPreview ({ commit }, params) {
    commit('SETTING_PRE', params)
    localStorage.setItem('row', JSON.stringify(params))
  }
}

export default {
  state,
  mutations,
  actions
}
