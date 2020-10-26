import axios from 'axios'
import settings from './settings.js'
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
