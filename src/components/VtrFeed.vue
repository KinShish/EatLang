<template lang="pug">
	div
		div(v-if="$route.name==='feed'")
			.header
				img.back(src="../assets/back.svg" @click="$router.go(-1)" v-if="$route.name!=='feed'")
				span Лента объявлений
			.whiteBlock
				div(v-for="item in 5" :key="item")
					router-link.infoGoodUser(:to="'feed/company/'+item")
						img(src="https://alna.ru/up/services_img/1427/03058d059257409dfe70e596ad320c9726e2ec93.jpg")
						span Имя пользователя
					VtrAdditionalProduct(:key="item" :hrefLink="'feed/good/'+item" :pageName="'Лента объявлений'")
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
			'VtrAdditionalProduct':()=>import('./additional/VtrAdditionalProduct'),
		},
	}
</script>

<style scoped>
	.whiteBlock{
		margin-top: 5px;
	}
</style>
