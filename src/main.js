import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './assets/css/icon.css'
// import vueSeamlessScroll from '@zengxiaohui/vue3-seamless-scroll'
// 导入mock
// require('./mock');
import('./mock/index')
const app = createApp(App)
installElementPlus(app)
app
    .use(store)
    .use(router)
    .use(Antd)
    .mount('#app')
