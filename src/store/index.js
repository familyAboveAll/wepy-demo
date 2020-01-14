import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import module1 from './modules/module1'
Vue.use(Vuex)
const state = {
  state1: 'sdsd'
}
const Store = new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    module1
  }
})
export default Store
