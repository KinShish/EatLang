<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Подробности заявки
		.greyBlock(v-if="order.id_order")
			.titleOrder
				span Заказ № {{order.id_order}}
				//span от:
				//span.name   Пал Палыч
			div(v-if="good.length!==0")
				VtrAdditionalPrivateProduct(:good="good" :hrefLink="'/good/'+good.id" :pageName="'Назад'")
			button.btnRed(@click="$_vtr_order_getOrder" v-if="order.status===0") Взять заказ
			.orderStatus(v-if="order.status===1") В обработке
			.orderStatus(v-if="order.status===2") Завершен

</template>

<script>
	export default {
		data(){
			return{
				order:[],
				good:[]
			}
		},
		methods:{
			async $_vtr_order_getOrder(){
				let data=await this.$store.getters.request('PUT',this.$store.state.user.settings.server+'company/order/'+this.$route.params.orderId)
				console.log(data)
				if(data&&!data.err){
					this.$router.push({path: '/chat/dialog/'+this.order.chat_key,query:{type:'manager'}})
				}else{
					this.$router.go(-1);
					this.$store.commit('notification','Прозошла ошибка, попробуйте позже')
				}
			},
			async $_vtr_order_loadInfo(){
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'company/order/'+this.$route.params.orderId)
				if(data&&!data.err){
					this.order=data.order;
				}else{
					this.$router.go(-1);
					this.$store.commit('notification','Прозошла ошибка, попробуйте позже')
				}
				let good=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/'+this.order.id_goods)
				if(good&&!good.err){
					this.good=good.good;
				}else{
					this.$router.go(-1);
					this.$store.commit('notification','Прозошла ошибка, попробуйте позже')
				}
			}
		},
		activated() {
			this.$_vtr_order_loadInfo();
		},
		components:{
			'VtrAdditionalPrivateProduct':()=>import('../additional/VtrAdditionalPrivateProduct'),
		},
	}
</script>

<style scoped>
	.titleOrder{
		padding: 13px 15px 0 15px;
	}
	.titleOrder span:nth-child(1){
		font-size: 18px;
		font-weight: bolder;
		display: block;
	}
	.titleOrder .name{
		color: #f54646;
	}
	.btnRed{
		width: 80%;
		max-width: 300px;
		margin: 100px auto 0 auto;
	}
	.orderStatus{
		width: 80%;
		max-width: 300px;
		margin: 100px auto 0 auto;
		background: #FFEEEE;
		border: 1px solid #F64646;
		box-sizing: border-box;
		border-radius: 3px;
		color: #F64646;
		font-size: 14px;
		text-align: center;
		padding: 5px 50px;
	}
</style>
