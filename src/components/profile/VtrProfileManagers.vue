<template lang="pug">
	div
		div(v-if="$route.name==='managers'")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span Менеджеры
			.mainBlock
				p Всего менеджеров 5
				.blockUser(v-for="item in 10")
					.blockImg
						img(src="https://alna.ru/up/services_img/1427/03058d059257409dfe70e596ad320c9726e2ec93.jpg")
					span Ну это прям очень длинное имя вашего менеджера ага?
					.btnEditManager
						router-link(:to="'managers/edit/1'")
							img(src="../../assets/edit.svg")
						img(src="../../assets/delete.svg" @click="vtr_manager_deleteManager('Димка 228',true)")
			.btnAddManager
				router-link(to="managers/add").btnRed Добавить нового менеджера
		transition(name="opacity")
			router-view
		b-modal(hide-footer ref="deleteManager" centered no-close-on-backdrop)
			template(slot="modal-header")
				h4 Удалить
				button.close(@click="vtr_manager_deleteManager('',false)")
					span(aria-hidden="true") x
			.container
				p Вы действительно хотите удалить менеджера
					span.redColor   {{managerName}}
				.btnModal
					span(@click="vtr_manager_deleteManager('',false)") Да
					span(@click="vtr_manager_deleteManager('',false)") Нет
</template>

<script>
	export default {
		data(){
			return{
				managerName:'',
			}
		},
		methods:{
			vtr_manager_deleteManager(name,type){
				this.managerName=name;
				if(type){
					this.$refs.deleteManager.show();
				}else{
					this.$refs.deleteManager.hide();
				}
			},
		}
	}
</script>

<style scoped>
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
	.blockUser span{
		display: inline-block;
		margin-left: 20px;
		white-space: nowrap;
		overflow: hidden;
		padding-right: 5px;
		flex: auto;
		text-overflow: ellipsis;
	}
	.btnAddManager{
		padding: 7px;
		margin: 13px;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		position: fixed;
		bottom: 50px;
		left: 50%;
		transform: translate(-50%, 0);
		width: fit-content;
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
