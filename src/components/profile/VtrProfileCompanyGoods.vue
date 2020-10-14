<template lang="pug">
	div
		div(v-if="$route.name==='companyGoods'")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span Объявления компании
			.customTabsProfile
				b-card(no-body)
					b-tabs(pills card)
						b-tab(title='АКТИВНЫЕ' active)
							.customTabContent
								VtrAdditionalPrivateProduct(v-for="item in 10" :key="item" :hrefLink="'companyGoods/good/'+item" :pageName="'Объявления компании'")
								//.noGoods Тут пусто :(
						b-tab(title='НА МОДЕРАЦИИ')
							.customTabContent
								.noGoods Тут пусто :(
						b-tab(title='АРХИВ')
							.customTabContent
								.noGoods Тут пусто :(
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
			'VtrAdditionalPrivateProduct':()=>import('../additional/VtrAdditionalPrivateProduct'),
		}
	}
</script>

<style scoped>
	.noGoods{
		text-align: center;
		font-size: 30px;
		line-height: 250px;
		color: #f54646;
	}
	.customTabsProfile{
		margin-top: 10px;
	}
</style>
