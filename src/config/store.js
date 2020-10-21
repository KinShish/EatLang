import axios from 'axios'
import settings from './settings.js'
import JsSIP from 'jssip'
export const userVuex = {
	state: {
		data: "-1",
		ua: '',
		managers:[],
		admin:false,
		token:null,
		errAuth:false,
		settings:settings,
		notification:'',
	},
	mutations: {
		firstAuth:async function (state,form){
			axios
				.post(state.settings.server+'user/sign',{phone:form.phone,password:form.password})
				.then(res => {
					if(!res.data.err) {
						localStorage.setItem('token',res.data.token);
						this.commit('auth');
					}else{
						this.commit('notification',res.data.text);
					}

				});
			axios.interceptors.response.use(null, error=> {
				if (error.response.status === 401) {
					this.commit('notification','Не верный логин или пароль');
				}
			})
		},
		auth:async function (state){
			let data=await this.getters.request('GET',state.settings.server+'user/profile');
			if(data){
				state.admin=data.admin;
				state.errAuth=false;
				state.company=data.company;
				state.data=data.user;
				state.managers=(data.managers!==undefined?data.managers:[]);
			}else{
				state.errAuth=true;
				this.commit('clearAll');
			}
		},
		logout:async function (state){
			let data=await this.getters.request('POST',state.settings.server+'user/logout');
			if(!data.err){
				this.commit('clearAll')
			}else{
				this.commit('notification','Произошла ошибка попробуйте позже');
			}
		},
		clearAll(state){
			localStorage.clear();
			state.admin=false
			state.errAuth=false;
			state.data='-1';
			state.managers=[];
		},
		notification(state,text){
			state.notification=text;
			setTimeout(()=>{state.notification=''},5000)
		},
		connectUser:async (state)=>{
			let socket = new JsSIP.WebSocketInterface('ws://192.168.0.205:8080');
			let configuration = {
				sockets  : [ socket ],
				uri      : 'sip:1000@192.168.0.205:5060',
				password : 'A123456789'
			};
			state.ua=new JsSIP.UA(configuration);
			console.log(await state.ua.start())
			console.log(state.ua)
			var eventHandlers = {
				'progress': function() {
					console.log('call is in progress');
				},
				'failed': function(e) {
					console.log('call failed with cause: '+ e.data.cause);
				},
				'ended': function(e) {
					console.log('call ended with cause: '+ e.data.cause);
				},
				'confirmed': function() {
					console.log('call confirmed');
				}
			};

			var options = {
				'eventHandlers'    : eventHandlers,
				'mediaConstraints' : { 'audio': true, 'video': true }
			};

			console.log(await state.ua.call('sip:1002@192.168.0.205:5060',options))
			state.ua.sendMessage('sip:1002@192.168.0.205:5060', 'text');

		},
	},
	getters: {
		request:state=>async (method,url,formData)=>{
			state.token=localStorage.getItem('token');
			if(state.token!==null){
				if(formData===undefined){formData={}}
				try {
					const {data}= await axios({method, url, data: formData,withCredentials:method==='PUT'?true:false,headers:{Authorization: "Bearer " + state.token}})
					if(!data.err) {
						return data;
					}else{
						//this.commit('notification',data.text);
						return false
					}
				}
				catch (e) {
					console.log(e)
					return false
				}
			}
		}
	},
};
