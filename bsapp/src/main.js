import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/comm/kmdev.js'
import * as echarts from 'echarts'
import video from "video.js"
import 'video.js/dist/video-js.css'


import axios from 'axios'
Vue.prototype.$http = axios
// 解决axios的post无法给后台传值的情况，qs包含在axios内，不必额外下载
import qs from 'qs'
Vue.prototype.$qs = qs

Vue.prototype.$video = video
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:3007/'
axios.interceptors.request.use(config => {
    console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem("token")
//  在最后必须return config
    return config
})
Vue.config.productionTip = false

Vue.prototype.$echarts = echarts

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')