import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import divideRedBack from './modules/divideRedBack'
import orderlistBeforeSearchStatus from './modules/orderlistBeforeSearchStatus'
import previewProduct from './modules/previewProduct'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    divideRedBack,
    orderlistBeforeSearchStatus,
    previewProduct
  },
  getters
})

export default store
