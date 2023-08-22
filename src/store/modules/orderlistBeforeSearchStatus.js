import Cookies from 'js-cookie'

let num = 2 // expires|unit/Days
let time= new Date(new Date().getTime() + num * 60 * 60 * 1000)


const state = {
  // orderlistBeforeSearchStatus: Cookies.get('orderlistBeforeSearchStatus') ? Cookies.get('orderlistBeforeSearchStatus') : '',
  orderlistBeforeSearchStatus: ''
}
const mutations = {
  SET_orderlistBeforeSearchStatus (state, params) {
    // Cookies.set('orderlistBeforeSearchStatus', params, { expires: time })
    state.orderlistBeforeSearchStatus = params
  }
}
const actions = {
  setorderlistBeforeSearchStatus ({ commit }, params) {
    commit('SET_orderlistBeforeSearchStatus', params)
  }
}

export default {
  state,
  mutations,
  actions
}
