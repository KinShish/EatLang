<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Подробности заявки
		.greyBlock(v-if="order.id_order")
			.titleOrder
				.orderStatus(v-if="order.status===1") В обработке
				.orderStatus(v-if="order.status===2") Завершен
				span Заказ № {{order.id_order}}
				//span от:
				//span.name   Пал Палыч
			div(v-if="good.length!==0")
				VtrAdditionalPrivateProduct(:good="good" :hrefLink="'/good/'+good.id" :pageName="'Назад'")
			button.btnRed(@click="$_vtr_order_getOrder" v-if="order.status===0") Взять заказ
			router-link.btnRed(@click="$_vtr_order_getOrder" :to="'/chat/dialog/'+order.chat_key" v-if="order.status!==0") В чат
			button.btnRed(@click="$refs.closeOrder.show()" v-if="order.status===1") Закрыть заказ
		b-modal(hide-footer ref="closeOrder" centered no-close-on-backdrop)
			template(slot="modal-header")
				h4 Заказ № {{order.id_order}}
				button.close( @click="$refs.closeOrder.hide()")
					span(aria-hidden="true") x
			.container
				p Вы уверены что хотите закрыть заказ?
				button.btnRed(@click="$_vtr_order_closeOrder") Да
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
			async $_vtr_order_closeOrder(){
				this.$refs.closeOrder.hide();
				let data=await this.$store.getters.request('PUT',this.$store.state.user.settings.server+'company/order/'+this.$route.params.orderId+'/close')
				if(data&&!data.err){
					this.$store.commit('notification','Заказ номер '+this.order.id_order+' закрыт')
				}else{
					this.$store.commit('notification','Прозошла ошибка, попробуйте позже')
				}
				//this.$router.go(-1);
			},
			async $_vtr_order_getOrder(){
				let data=await this.$store.getters.request('PUT',this.$store.state.user.settings.server+'company/order/'+this.$route.params.orderId)
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
		margin: 10px auto;
		text-decoration: none;
		color: white;
	}
	.orderStatus{
		width: 80%;
		max-width: 300px;
		margin: 0 auto;
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
