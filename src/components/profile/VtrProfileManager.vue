<template lang="pug">
	div
		div(v-if="$route.name==='manager'")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span {{user.name}}
			.logoBlock(v-if="true")
				img.logo(:src="$store.state.user.settings.server+'company/'+2+'/up/logo.jpg'" v-if="user.logo")
				div(v-else)
					img(src="../../assets/loadLogo.svg")
					span Фото отсутствует
			.blockBtnProfile
				.socialBlocks
					router-link.socBlock(:to="$route.params.id+'/favorites/'+$route.params.id")
						div
							img(src="../../assets/favorits.svg")
							span {{favorites.length}}
						p Избранное
					router-link.socBlock(:to="$route.params.id+'/notification/'+$route.params.id")
						div
							img(src="../../assets/notifications.svg")
						p Уведомления
			.customTabsProfile
				b-card(no-body)
					b-tabs(pills card v-model="tabIndexManager")
						b-tab(title='АКТИВНЫЕ' @click="$_vtr_profile_clickTab(1)")
							.customTabContent
								.greyBlock(v-if="ordersArray.orders[1].length===0&&(load&&stopLoad)")
									p.noOrder Заявок нет
								.whiteBlock(v-else)
									router-link.mainOrderBlock(v-for="order in ordersArray.orders[1]" :to="'/order/'+order.id_order" :key="order.id_order")
										.orderManagerBlock
											.orderBlockImg
												img(:src="$store.state.user.settings.server+'company/'+$store.state.user.data.id_company+'/'+order.img" v-if="order.img!==''")
												img.noImgOrder(src="../../assets/loadLogo.svg" v-else)
											.orderBlockInfo
												span {{order.name}}
											span.orderDate {{order.date}}
										.orderNumberAndPrice
											span Заказ № {{order.id_order}}
											span {{order.price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,'$1' + ' ')+' ₽'}}
										hr.orderBorder
						b-tab(title='ЗАВЕРШЕННЫЕ' @click="$_vtr_profile_clickTab(2)")
							.customTabContent
								.greyBlock(v-if="ordersArray.orders[2].length===0&&(load&&stopLoad)")
									p.noOrder Заявок нет
								.whiteBlock(v-else)
									router-link.mainOrderBlock(v-for="order in ordersArray.orders[2]" :to="'/order/'+order.id_order" :key="order.id_order")
										.orderManagerBlock
											.orderBlockImg
												img(:src="$store.state.user.settings.server+'company/'+$store.state.user.data.id_company+'/'+order.img" v-if="order.img!==''")
												img.noImgOrder(src="../../assets/loadLogo.svg" v-else)
											.orderBlockInfo
												span {{order.name}}
											span.orderDate {{order.date}}
										.orderNumberAndPrice
											span Заказ № {{order.id_order}}
											span {{order.price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,'$1' + ' ')+' ₽'}}
										hr.orderBorder
		transition(name="opacity")
			keep-alive
				router-view
</template>

<script>
	export default {
		data(){
			return{
				user:[],
				favorites:[],
				ordersArray:{
					orders:{'1':[], '2':[]},
					date:{'1':1, '2':1}
				},
				status:1,
				load:true,
				stopLoad:false,
				tabIndexManager:0
			}
		},
		methods:{
			async $_vtr_profile_manager_load(){
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'user/profile/'+this.$route.params.id)
				if(data&&!data.err){
					this.user=data.user;
					this.favorites=data.favorites;
				}else{
					this.$router.go(-1);
					this.$store.commit('notification','Прозошла ошибка, попробуйте позже')
				}
			},
			$_vtr_profile_clickTab(status){
				if(this.status!==status){
					this.status=status;
					this.load=false;
					this.stopLoad=false;
					this.ordersArray.orders[status]=[];
					this.ordersArray.date[status]=1;
					this.$_vtr_profile_loadOrders();
				}
			},
			async $_vtr_profile_loadOrders(){
				if(this.$route.name==='manager'&&!this.load){
					let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'user/'+this.$route.params.id+'/orders'+'/'+this.status+'/'+this.ordersArray.date[this.status])
					if(data){
						if(!data.err){
							this.ordersArray.orders[this.status]=this.ordersArray.orders[this.status].concat(data.orders);
							if(data.orders.length>0){
								this.ordersArray.date[this.status]=Date.parse(new Date(this.ordersArray.orders[this.status][this.ordersArray.orders[this.status].length - 1].update.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")));
							}
						}
					}
					this.load=true;
					this.stopLoad=data.orders.length===0||this.ordersArray.orders[this.status].length<=10;
				}
			},
		},
		created() {
			this.load=false;
			this.$_vtr_profile_manager_load();
			this.$_vtr_profile_loadOrders();
			this.$root.$on('lazyLoad', (res)=>{
				if(res&&this.load&&!this.stopLoad){
					this.load=false;
					this.$_vtr_profile_loadOrders();
				}
			});
		}
	}
</script>

<style scoped>
	.whiteBlock{
		padding: 5px 0 50px 0;
	}
	.noOrder{
		color: #757575;
		text-align: center;
		font-size: 16px;
		padding-bottom: 28px;
	}
	.mainOrderBlock{
		margin: 13px 15px 0 15px;
		display: block;
		color: black;
	}
	.orderManagerBlock{
		display: flex;
	}
	.orderBlockImg{
		width: 50px;
		height: 40px;
		background: #DEDEDE;
		line-height: 40px;
		min-width: 50px;
		overflow: hidden;
		border-radius: 3px;
		display: grid;
		place-content: center;
	}
	.orderBlockImg img{
		width: auto;
		height: 40px;
		display: block;
		margin: 0 auto;
	}
	.orderBlockInfo{
		font-size: 12px;
		margin-left: 10px;
		white-space: nowrap;
		overflow: hidden;
		padding-right: 5px;
		display: block;
		flex: auto;
	}
	.orderBlockInfo span{
		display: block;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.orderBlockInfo span:nth-child(2){
		color: #757575;
	}
	.orderDate{
		font-size: 12px;
		color: #757575;
		margin-left: 10px;;
	}
	.orderNumberAndPrice{
		font-size: 14px;
	}
	.orderNumberAndPrice span:nth-child(2){
		display: inline-block;
		float: right;
		color: #26C281;
	}
	.orderBorder{
		border: 1px dashed #757575;
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
	.logo{
		width: auto !important;
		max-height: 250px;
		height: auto;
		margin: -30px 0;
	}
	.blockBtnProfile{
		padding-bottom: 10px;
		margin-bottom: 10px;
		border-bottom: 1px dashed #757575;
	}
	.socialBlocks{
		display: flex;
		padding: 10px 0;
		font-weight: bold;
	}
	.socBlock{
		background-color: white;
		max-width: 150px;
		flex: 1;
		margin: 0 auto;
		box-shadow: 0 4px 5px rgba(0, 0, 0, 0.06);
		border-radius: 5px;
		padding: 7px;
		color: black;
		text-decoration: none;
		overflow: hidden;
	}
	.socBlock div{
		display: flex;
	}
	.socBlock p{
		margin-top: 20px;
		margin-bottom: 0;
	}
	.socBlock span{
		width: 100%;
		text-align: right;
		padding-right: 10px;
		font-size: 20px;
		font-weight: bolder;
	}
	.socBlock img{
		width: 30px;
		height: 30px;
	}
</style>
