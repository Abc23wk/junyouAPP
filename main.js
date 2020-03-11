import Vue from 'vue'
import App from './App'
import store from './store'
import ltabbar from './components/ltabbar.vue'
import * as filters from './filters'
// 过滤器封装
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.component('ltabbar',ltabbar)
Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
