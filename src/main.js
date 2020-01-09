import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import '@/assets/css/theme.css';
import VueI18n from 'vue-i18n';
import util from './libs/util';
import httpTool from './tools/httpTool';
import validator from './libs/validator';
import Request from './tools/request';
import './icons/style.css';
import './components/index';
import config from './config';
import axios from 'axios';
require('./mock');

Vue.use(VueI18n);
Vue.use(iView);
Vue.use(Request);
Vue.prototype.$http = httpTool;
Vue.prototype.$util = util;
Vue.prototype.$validator = validator;
Vue.prototype.$config = config;
Vue.prototype.$axios = axios;
new Vue({
	el: '#app',
	router: router,
	store: store,
	render: h => h(App)
});
