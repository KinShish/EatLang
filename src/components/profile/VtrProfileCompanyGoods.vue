<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Объявления компании
		.customTabsProfile
			b-card(no-body)
				b-tabs(pills card)
					b-tab(title='АКТИВНЫЕ' active)
						.customTabContent
							VtrAdditionalProduct(v-for="item in 10" :key="item")
							//.noGoods Тут пусто :(
					b-tab(title='НА МОДЕРАЦИИ')
						.customTabContent
							.noGoods Тут пусто :(
					b-tab(title='АРХИВ')
						.customTabContent
							.noGoods Тут пусто :(
</template>

<script>
	export default {
		data(){
			return{

			}
		},
		components:{
			'VtrAdditionalProduct':()=>import('../additional/VtrAdditionalProduct'),
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
