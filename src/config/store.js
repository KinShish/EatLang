import axios from 'axios'
import settings from './settings.js'
import JsSIP from 'jssip'
const io = require('../config/socket.io');
let socket = '';
window.onbeforeunload=(e=>{
	if(userVuex.state.data!=='-1') socket.emit('exit')
})
export const chatVuex = {
	getters:{
		createRoom:()=>(data,cb)=>{
			socket.emit('create room',data,(res)=>{
				cb(res)
			})
		},
		submitChat:()=>(data,cb)=> {
			socket.emit('send message', data,(res)=>{
				socket.emit('message', {hash: data.hash, user: userVuex.state.data.id === data.id});
				cb(res)
			})

		},
		createOldRoom:()=>(data,cb)=>{
			socket.emit('create old room',data,(res)=>{
				cb(res)
			})
		},
	}
};
export const userVuex = {
	state: {
		data: "-1",
		ua: '',
		managers:[],
		admin:false,
		token:null,
		errAuth:null,
		settings:settings,
		notification:'',
		cats:[],
		favorites:[],
		rooms:[],
		messages:[]
	},
	mutations: {
		async firstAuth(state,form){
			axios
				.post(state.settings.server+'user/sign',{phone:form.phone,password:form.password})
				.then(res => {
					if(!res.data.err) {
						state.errAuth=false;
						localStorage.setItem('token',res.data.token);
						this.commit('auth');
					}else{
						state.errAuth=new Date().getTime();
						this.commit('notification',res.data.text);
					}

				})
				.catch(err=>{
					state.errAuth=new Date().getTime();
					this.commit('notification','Произошла ошибка попробуйте позже');
				});
			axios.interceptors.response.use(null, error=> {
				if (error.response.status === 401) {
					state.errAuth=new Date().getTime();
					this.commit('notification','Не верный логин или пароль');
				}
			})
		},
		async auth (state){
			let data=await this.getters.request('GET',state.settings.server+'user/profile');
			if(data){
				state.admin=data.admin;
				state.errAuth=false;
				state.company=data.company;
				state.data=data.user;
				state.favorites=data.favorites
				state.managers=(data.managers!==undefined?data.managers:[]);
				socket = io(settings.serverChat,{path: '/vtr/chat',query:{token:localStorage.getItem('token')}});
				socket.on('room message',res=>{
					state.messages.push(res);
				});
				this.commit('loginChat',false)
				this.commit('loadCat')
			}else{
				state.errAuth=new Date().getTime();
				this.commit('clearAll');
			}
		},
		loginChat(state,f){
			const emit=()=>{
				socket.emit('user join',(rooms)=>{
					if(state.rooms.length!==rooms.length){
						state.rooms=rooms;
					}
				});
			}
			if(f) emit();
			else {
				socket.emit('first join',(rooms,messages)=>{
					state.rooms=rooms;
					state.messages=messages;
				});
				setInterval(emit, 10000)
			}
		},
		async logout (state){
			let data=await this.getters.request('POST',state.settings.server+'user/logout');
			if(!data.err){
				socket.emit('exit');
				this.commit('clearAll');
			}else{
				this.commit('notification','Произошла ошибка попробуйте позже');
			}
		},
		clearAll(state){
			localStorage.clear();
			state.admin=false
			state.errAuth=true;
			state.data='-1';
			state.managers=[];
		},
		notification(state,text){
			state.notification=text;
			setTimeout(()=>{state.notification=''},5000)
		},
		updateLogoCompany(state,value){
			state.company.logo=value
		},
		async loadCat (state){
			let data=await this.getters.request('GET',state.settings.server+'cat')
			if(data&&!data.err){
				state.cats=data.cats
			}
		},
		editFavorits(state,id){
			let index=state.favorites.indexOf(id);
			if(index===-1){
				state.favorites.push(id)
			}else{
				state.favorites.splice(index, 1)
			}
		},
		editManager(state,data){
			for(let manager of state.managers){
				if(manager.id===data.id){
					manager.block=data.type
					break
				}
			}
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
				'progress': function() {11
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
					const {data}= await axios({method, url, data: formData,headers:{Authorization: "Bearer " + state.token}})
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
		},
		watchFavoritGood:state=>(id)=>{
			return state.favorites.indexOf(id)!==-1
		},
	},
};
