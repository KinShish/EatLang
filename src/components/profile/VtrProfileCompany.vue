<template lang="pug">
	div
		div(v-if="$route.name==='feedCompany'||$route.name==='searchCompany'")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span Название компании
			.logoBlock
				img(src="../../assets/loadLogo.svg")
				span Фото отсутствует
			button.btnRed Подписаться
			button.btnRed Контакты компании
			.title Объявления пользователя
			VtrAdditionalProduct(v-for="item in 10" :key="item" :hrefLink="$route.params.idComp+'/good/'+item" :pageName="'Название компании'")
		transition(name="opacity")
			router-view
</template>

<script>
	export default {
		data(){
			return{

			}
		},
		components:{
			'VtrAdditionalProduct':()=>import('../additional/VtrAdditionalProduct'),
		},
	}
</script>

<style scoped>
	.title{
		font-size: 18px;
		font-weight: bold;
		color: #333333;
		margin-left: 2.5%;
		margin-top: 20px;
	}
	.btnRed{
		width: 95%;
		margin: 5px auto;
	}
	.logoBlock{
		padding: 30px 0;
		color: #868686;
		text-align: center;
		background-color: white;
		display: block;
	}
	.logoBlock span{
		margin-top: 20px;
		display: block;
	}
	.logoBlock img{
		width: 70px;
	}
</style>
