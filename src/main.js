import Vue from 'vue'
import App from './App'
// 引入store
import MpvueRouterPatch from 'mpvue-router-patch'
Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
