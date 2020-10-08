import axios from 'axios'
import settings from './settings.js'
export const userVuex = {
	state: {
		data: "-1",
		managers:[],
		admin:false,
		token:null,
		errAuth:false,
		settings:settings,
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
						alert(res.data.text);
					}

				});
		},
		auth:async function (state){
			let data=await this.getters.request('GET',state.settings.server+'user/profile');
			if(data){
				state.admin=data.admin;
				state.errAuth=false;
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
				alert('Произошла ошибка попробуйте позже')
			}
		},
		clearAll(state){
			localStorage.clear();
			state.admin=false
			state.errAuth=false;
			state.data='-1';
			state.managers=[];
		},
	},
	getters: {
		request:state=>async (method,url,formData)=>{
			state.token=localStorage.getItem('token')
			if(state.token!==null){
				if(formData===undefined){formData={}}
				try {
					const {data}= await axios({method, url, data: formData,headers:{Authorization: "Bearer " + state.token}})
					if(!data.err) {
						return data;
					}else{
						alert(data.text);
						return false
					}
				}
				catch (e) {
					return false
				}
			}
		}
	},
};
