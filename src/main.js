import Vue from 'vue'

Vue.config.productionTip = false

import VueRouter from 'vue-router'
import Vuex from 'vuex'
import {BootstrapVue} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../src/css/index.css'
import Vuelidate from 'vuelidate'
import VueMask from 'v-mask'



Vue.use(VueMask);
Vue.use(Vuelidate)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(BootstrapVue);





import {userVuex} from "./config/store";
const store = new Vuex.Store({
	modules: {
	user: userVuex,
	}
});
import {router} from './config/routes';





let app = {
	initialize: function() {
		this.bindEvents();
		//this.setupVue();//закоментить для запуска на телефоне
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},
	receivedEvent: function(id) {
		this.setupVue();//закоментить для запуска в Web
		console.log('Received Event: ' + id);
	},
	setupVue: function() {
		new Vue({
			name:"app",
			el: "#app",
			store,
			data() {
				return {

				}
			},
			router,
		});
	},
};

app.initialize();
