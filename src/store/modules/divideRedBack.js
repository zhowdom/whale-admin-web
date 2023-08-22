import Cookies from 'js-cookie'

let num = 2 // expires|unit/Days
let time= new Date(new Date().getTime() + num * 60 * 60 * 1000)


const state = {
  ms: Cookies.get('ms') ? Cookies.get('ms') : ''
}
const mutations = {
  SET_MS (state, params) {
    Cookies.set('ms', params.name, { expires: time })
    state.ms = params.name
  },
  SETTING_MS (state, params) {
    Cookies.set('ms', params.name, { expires: time })
    state.ms = params.name
  }
}
const actions = {
  setMs ({ commit }, params) {
    commit('SETTING_MS', params)
  }
}

export default {
  state,
  mutations,
  actions
}
