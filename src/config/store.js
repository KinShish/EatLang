import axios from 'axios'
import settings from './settings.js'
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
	},
};
export const userVuex = {
	state: {
		data: "-1",
		ua: '',
		newMessage: {
			key:'',
			hash:''
		},
		managers:[],
		admin:false,
		token:null,
		errAuth:null,
		settings:settings,
		notification:'',
		cats:[],
		favorites:[],
		rooms:{},
	},
	mutations: {
		newMessageGetNull(state){
			state.newMessage={
				key:'',
				hash:''
			}
		},
		firstAuthRequest(state,data){
			axios
				.post(state.settings.server+'user/sign',data)
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
		firstAuth(state,form){
			if(process.env.NODE_ENV!=='development') {
				FirebasePlugin.grantPermission(function (hasPermission) {
					console.log("Permission was " + (hasPermission ? "granted" : "denied"));
				});
				FirebasePlugin.hasPermission(function (hasPermission) {
					console.log("Permission is " + (hasPermission ? "granted" : "denied"));
				});
				FirebasePlugin.getToken((fcmToken)=> {
					let data={phone: form.phone, password: form.password,token:fcmToken};
					this.commit('firstAuthRequest',data);
				}, function(error) {
					state.errAuth=new Date().getTime();
					this.commit('notification','Произошла ошибка попробуйте позже');
				});
			}else{
				let data={phone: form.phone, password: form.password};
				this.commit('firstAuthRequest',data);
			}
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
					console.log(res)
					//dateTime,hash,id,id_recipient,key,text,watch
					state.newMessage={key:res.key,hash:res.hash};
					state.rooms[res.key].message=res;
					state.rooms[res.key].messages.push(res);
					state.rooms[res.key].notification=this.getters.watchChatMessage(res.key);
					FirebasePlugin.setBadgeNumber(this.getters.watchChatMessage('all'));
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
					if(Object.keys(state.rooms).length!==rooms.length){
						rooms.forEach(r=>{
							state.rooms[r.key]=r
							state.rooms[r.key].notification=this.getters.watchChatMessage(r.key)
						})
					}
				});
			}
			if(f) emit();
			else {
				socket.emit('first join',(rooms,messages)=>{
					state.messages=messages;
					localStorage.setItem("messages",JSON.stringify(messages))
					rooms.forEach(r=>{
						state.rooms[r.key]=r
						state.rooms[r.key].messages=messages.filter(mess=>mess.key===r.key).sort((a, b) => {const dateA = new Date(a.dateTime), dateB = new Date(b.dateTime);return dateA.getTime() - dateB.getTime()});
						state.rooms[r.key].message=state.rooms[r.key].messages.slice(-1)[0];
						state.rooms[r.key].notification=this.getters.watchChatMessage(r.key);
					})
					console.log(state.rooms)
					localStorage.setItem("rooms",JSON.stringify(state.rooms))
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
			state.rooms={};
			state.newMessage={
				key:'',
				hash:''
			}
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
		watchMessage(state,hash){
			socket.emit('watch', hash);
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
		watchChatMessage:state=>(key)=>{
			if(key==='all'){
				let length=0;
				Object.values(state.rooms).forEach(r=>{
					length+=r.notification
				})
				console.log(length)
				return length
			}
			return state.rooms[key].messages.filter(mess=>!mess.watch).filter(mess=>mess.id!==state.data.id).length
		},
	},
};
