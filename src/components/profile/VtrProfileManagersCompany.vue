<template lang="pug">
	div
		div(v-if="$route.name==='managers'")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span Менеджеры
			.mainBlock
				p Всего менеджеров {{$store.state.user.managers.length}}
				.blockUser(v-for="manager in $store.state.user.managers" :key="manager.name")
					router-link.blockImg(:to="'managers/manager/'+manager.id")
						img(src="https://alna.ru/up/services_img/1427/03058d059257409dfe70e596ad320c9726e2ec93.jpg")
					router-link(:to="'managers/manager/'+manager.id")
						span {{manager.name}}
					.btnEditManager
						//router-link(:to="'managers/edit/'+manager.id")
							img(src="../../assets/edit.svg")
						img(src="../../assets/delete.svg" @click="vtr_manager_banManagerModal(manager.name,true,manager.id,manager.block)" :class="manager.block?'banManager':''")
			//.btnAddManagerMain
				.btnAddManager
					router-link(to="managers/add").btnRed Добавить нового менеджера
			b-modal(hide-footer ref="deleteManager" centered no-close-on-backdrop)
				template(slot="modal-header")
					h4 Удалить
					button.close(@click="vtr_manager_banManagerModal('',false)")
						span(aria-hidden="true") x
				.container
					p Вы действительно хотите {{blockManager===0?'заблокировать':'разблокировать'}} менеджера
						span.redColor   {{manager.name}}?
					.btnModal
						span(@click="vtr_manager_banManager") Да
						span(@click="vtr_manager_banManagerModal('',false)") Нет
		transition(name="opacity")
			router-view
</template>

<script>
	export default {
		data(){
			return{
				manager: {name:'',id:0},
				blockManager:0
			}
		},
		methods:{
			vtr_manager_banManagerModal(name,type,id,block){
				if(type){
					this.manager.name=name;
					this.manager.id=id;
					this.blockManager=block;
					this.$refs.deleteManager.show();
				}else{
					this.$refs.deleteManager.hide();
					this.blockManager=0;
					this.manager.name='';
					this.manager.id=0;
				}
			},
			async vtr_manager_banManager(){
				let data=await this.$store.getters.request('PUT',this.$store.state.user.settings.server+'user/'+this.manager.id+'/block')
				if(data&&!data.err){
					if(data.block){
						this.$store.commit('editManager',{id:this.manager.id,type:this.blockManager===0?this.blockManager+1:this.blockManager-1})
						this.$store.commit('notification','Менеджер '+this.manager.name+(this.blockManager===0?'    заблокирован':'    разблокирован'))
						this.manager={name:'',id:0};
						this.blockManager=0;
					}
				}
				this.$refs.deleteManager.hide();
			}
		},
	}
</script>

<style scoped>
	.banManager{
		transform: rotate(45deg);
	}
	.mainBlock{
		margin: 13px 15px 0 15px;
		padding-bottom: 50px;
	}
	.mainBlock p:nth-child(1){
		font-size: 18px;
	}
	.blockUser{
		height: 60px;
		line-height: 60px;
		display: flex;
		margin-bottom: 15px;
	}
	.blockUser a:nth-child(2){
		color: black !important;
		text-decoration: none;
		margin-left: 20px;
		white-space: nowrap;
		overflow: hidden;
		padding-right: 5px;
		flex: auto;
		text-overflow: ellipsis;
	}
	.blockUser img{
		transition: .3s ease;
	}
	.blockImg{
		height: 60px;
		width: 60px;
		border-radius: 50%;
		overflow: hidden;
		display: inline-block;
		min-width: 60px;
	}
	.btnEditManager{
		display: flex;
		float: right;
	}
	.btnEditManager img:nth-child(1){
		display: block;
	}
	.btnEditManager a{
		margin: 0 5px;
		height: 22px;
		width: 22px;
		top: 50%;
		position: relative;
		transform: translate(0, -50%);
	}
	.btnEditManager img:nth-child(2){
		margin: 0 5px;
		height: 22px;
		width: 22px;
		top: 50%;
		position: relative;
		transform: translate(0, -50%);
	}
	.blockImg img{
		width: 100%;
		height: 100%;
		display: block;
	}
	.btnAddManagerMain{
		position: fixed;
		bottom: 10px;
		width: 100%;
	}
	.btnAddManager{
		padding: 7px;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		width: 95%;
		margin: 0 auto;
		max-width: 400px;
		text-align: center;
	}
	.btnAddManager a{
		color: white;
		text-decoration: none;
	}
	.btnModal{
		text-align: right;
	}
	.btnModal span{
		color: #F64646;
		margin-left: 30px;
	}
	@media (max-width : 730px) {
		.btnAddManager .btnRed{
			padding: 5px 20px;
			font-size: 14px;
		}
	}
	@media (max-width : 365px) {
		.btnAddManager .btnRed{
			padding: 5px 20px;
			font-size: 12px;
		}
	}
</style>
