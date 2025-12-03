import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
// 开发环境下引入 Mock
if (process.env.NODE_ENV === 'development') {
  // H5 环境
  // #ifdef H5
  import('./mock/index.js')
  // #endif
  
  // 小程序和 APP 环境
  // #ifdef MP || APP-PLUS
  require('./mock/index.js')
  // #endif
}
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif