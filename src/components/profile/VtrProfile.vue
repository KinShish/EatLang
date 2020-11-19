<template lang="pug">
	div
		div(v-if="$route.name==='profile'")
			.header
				span {{$store.state.user.admin?$store.state.user.company.name:$store.state.user.data.name}}
				img.exit(src="../../assets/exit.svg" @click="$store.commit('logout')")
			//фото начало ******************************
			b-spinner.customSpiner.loadLogoSpiner(variant="danger" v-if="downloadLogo")
			label.loadLogoBlock(for="laodlogoinp" v-if="$store.state.user.admin")
				div(v-if="!$store.state.user.company.logo")
					img(src="../../assets/loadLogo.svg")
					span Загрузите логотип компании
				img.logo(:src="$store.state.user.settings.server+'company/'+$store.state.user.data.id_company+'/up/logo.jpg?key='+keyLogo" v-else-if="$store.state.user.data.id_company")
				b-form-file#laodlogoinp.d-none(type="file" @input="$_vtr_profile_loadLogo(fileLogo)" v-model="fileLogo")
			.loadLogoBlock(v-else-if="$store.state.user.company.logo")
				img.logo(:src="$store.state.user.settings.server+'company/'+$store.state.user.data.id_company+'/up/logo.jpg?key='+keyLogo" v-if="$store.state.user.data.id_company")
			.loadLogoBlock(v-else-if="!$store.state.user.company.logo")
				div
				img(src="../../assets/loadLogo.svg")
				span Фото отсутствует
			//фото конец ******************************
			.blockBtnProfile
				.socialBlocks
					router-link.socBlock(to="/profile/favorites")
						div
							img(src="../../assets/favorits.svg")
							span {{$store.state.user.favorites.length}}
						p Избранное
					router-link.socBlock(:to="$store.state.user.admin?'/profile/managers':'/profile/companyGoods'")
						div
							img(src="../../assets/managers.svg")
							span {{$store.state.user.admin?$store.state.user.managers.length:$store.state.user.goods_count}}
						p {{$store.state.user.admin?'Менеджеры':'Объявления'}}
				router-link.btnProfile(to="profile/settings" v-if="$store.state.user.admin")
					img(src="../../assets/settings.svg")
					span Настройки профиля
				router-link.btnProfile(to="profile/notifications")
					img(src="../../assets/notifications.svg")
					span Уведомления
			.customTabsProfile(:class="$store.state.user.admin?'':'hideTabProfile'")
				b-card(no-body)
					b-tabs(pills card v-model="tabMainIndex")
						b-tab(title='Объявления компании' @click="$_vtr_profile_clickMainTab(0)" v-if="$store.state.user.admin")
							h4.titleTab Объявления
							.customTabContent
								.customTabsProfile
									b-card(no-body)
										b-tabs(pills card v-model="tabIndex")
											b-tab(title='АКТИВНЫЕ' @click="$_vtr_profile_clickTab(1)")
												.customTabContent
													.noGoods(v-if="goodsArray.goods[1].length===0&&(load&&stopLoad)") Тут пусто :(
													VtrAdditionalPrivateProduct(v-else v-for="good in goodsArray.goods[1]" :key="good.id+'active'" :good="good" :hrefLink="'/good/'+good.id" :pageName="'Личный кабинет'")
													b-spinner.customSpiner(variant="danger" v-if="!load&&!stopLoad")
											b-tab(title='НА МОДЕРАЦИИ' @click="$_vtr_profile_clickTab(0)")
												.customTabContent
													.noGoods(v-if="goodsArray.goods[0].length===0&&(load&&stopLoad)") Тут пусто :(
													VtrAdditionalPrivateProduct(v-else v-for="good in goodsArray.goods[0]" :key="good.id+'moder'" :good="good" :hrefLink="'/good/'+good.id" :pageName="'Личный кабинет'")
													b-spinner.customSpiner(variant="danger" v-if="!load&&!stopLoad")
											b-tab(title='АРХИВ' @click="$_vtr_profile_clickTab(3)")
												.customTabContent
													.noGoods(v-if="goodsArray.goods[3].length===0&&(load&&stopLoad)") Тут пусто :(
													VtrAdditionalPrivateProduct(v-else v-for="good in goodsArray.goods[3]" :key="good.id+'arch'" :good="good" :hrefLink="'/good/'+good.id" :pageName="'Личный кабинет'")
													b-spinner.customSpiner(variant="danger" v-if="!load&&!stopLoad")
						b-tab(title='Заявки компании' @click="$_vtr_profile_clickMainTab(1)")
							h4.titleTab Заявки
							.customTabContent
								.customTabsProfile
									b-card(no-body)
										b-tabs(pills card v-model="tabIndexManager")
											b-tab(title='В ОЖИДАНИИ' @click="$_vtr_profile_clickTab(0)")
												.customTabContent
													.greyBlock(v-if="ordersArray.orders[0].length===0&&(load&&stopLoad)")
														p.noOrder Заявок нет
													.whiteBlock(v-else)
														router-link.mainOrderBlock(v-for="order in ordersArray.orders[0]" :to="'/order/'+order.id_order" :key="order.id_order")
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
				fileLogo:[],

				goodsArray:{
					goods:{'0':[], '1':[],'3':[],},
					date:{'0':1, '1':1, '3':1,}
				},
				ordersArray:{
					orders:{'0':[], '1':[], '2':[]},
					date:{'0':1, '1':1, '2':1}
				},

				status:1,
				load:true,
				stopLoad:false,
				keyLogo:new Date().valueOf(),
				downloadLogo:false,

				mainIndex:0,
				tabMainIndex:0,
				tabIndex:0,
				tabIndexManager:0
			}
		},
		components:{
			'VtrAdditionalPrivateProduct':()=>import('../additional/VtrAdditionalPrivateProduct'),
		},
		beforeRouteLeave(to,form,next) {
			if(!(to.name==='good'||to.name==='company'||to.name==='order'||to.name==='dialog')){
				this.$destroy()
			}
			next()
		},
		mounted() {
			this.load=false;
			if(this.$store.state.user.admin){
				this.status=1;
				this.$_vtr_profile_loadGoods();
			}else{
				this.mainIndex=1
				this.status=0;
				this.$_vtr_profile_loadOrders();
			}
			this.$root.$on('lazyLoad', (res)=>{
				if(res&&this.load&&!this.stopLoad){
					this.load=false;
					if(this.mainIndex){
						this.$_vtr_profile_loadOrders();
					}else{
						this.$_vtr_profile_loadGoods();
					}
				}
			});
		},
		methods:{
			$_vtr_profile_clickMainTab(type){
				this.load=false;
				this.stopLoad=false;
				this.mainIndex=type;
				if(type){
					this.ordersArray={orders:{'0':[],'1':[],'2':[]},date:{'0':1, '1':1, '2':1}}
					this.status=0;
					this.tabIndexManager=0;
					this.$_vtr_profile_loadOrders();
				}else{
					this.goodsArray={goods:{'0':[],'1':[],'3':[],},date:{'0':1, '1':1, '3':1,}}
					this.status=1;
					this.tabIndex=0;
					this.$_vtr_profile_loadGoods();
				}
			},
			$_vtr_profile_clickTab(status){
				if(this.status!==status){
					this.status=status;
					this.load=false;
					this.stopLoad=false;
					if(this.mainIndex){
						this.ordersArray.orders[status]=[];
						this.ordersArray.date[status]=1;
						this.$_vtr_profile_loadOrders();
					}else{
						this.goodsArray.goods[status]=[];
						this.goodsArray.date[status]=1;
						this.$_vtr_profile_loadGoods();
					}
				}
			},
			async $_vtr_profile_loadGoods(){
				if(this.$route.name==='profile'&&!this.load&&this.$store.state.user.admin){
					let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/company/'+this.$store.state.user.data.id_company+'/'+this.status+'/'+this.goodsArray.date[this.status])
					if(data){
						this.load=true;
						if(!data.err&&data.rights&&!this.stopLoad){
							this.goodsArray.goods[this.status]=this.goodsArray.goods[this.status].concat(data.goods);
							if(data.goods.length>0){
								this.goodsArray.date[this.status]=Date.parse(new Date(this.goodsArray.goods[this.status][this.goodsArray.goods[this.status].length - 1].update.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")));
							}
						}
					}
					this.stopLoad=data.goods.length===0||this.goodsArray.goods[this.status].length<=10;
				}
			},
			async $_vtr_profile_loadOrders(){
				if(this.$route.name==='profile'&&!this.load){
					let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'company/orders'+'/'+this.status+'/'+this.ordersArray.date[this.status])
					if(data){
						if(!data.err){
							this.ordersArray.orders[this.status]=this.ordersArray.orders[this.status].concat(data.orders);
							if(data.orders.length>0){
								this.ordersArray.date[this.status]=Date.parse(new Date(this.ordersArray.orders[this.status][this.ordersArray.orders[this.status].length - 1].update.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")));
							}
						}
						this.load=true;
					}
					this.stopLoad=data.orders.length===0||this.ordersArray.orders[this.status].length<=10;
				}
			},
			async $_vtr_profile_loadLogo(file){
				if(file){
					if (!/\.(jpeg|jpe|jpg|png|webp)$/i.test(file.name)) {
						this.$store.commit('notification',"Файл  "+file.name+"  не поддерживается")
					}else{
						this.downloadLogo=true;
						let data = new FormData();
						data.append('file', file);
						let logo=await this.$store.getters.request('POST',this.$store.state.user.settings.server+'company/logo',data)
						if(logo&&!logo.err){
							this.$store.commit('updateLogoCompany',1)
							setTimeout(()=>{this.keyLogo=new Date().valueOf()},1000)
						}else{
							this.$store.commit('notification',"Произошла ошибка, попробуйте позже")
						}
						setTimeout(()=>{this.downloadLogo=false;},1000)

					}
				}
			}
		}
	}
</script>

<style scoped>
	.noImgOrder{
		height: 30px !important;
	}
	.orderBorder{
		border: 1px dashed #757575;
	}
	.customTabContent{
		margin-bottom: 60px;
	}
	.loadLogoSpiner{
		position: absolute;
		left: 0;
		right: 0;
		top: 140px;
	}
	.logo{
		width: auto !important;
		max-height: 250px;
		height: auto;
		margin-top: -30px;
	}
	.exit{
		float: right;
		line-height: 50px;
		display: block;
		margin: 15px 10px;
	}
	.whiteBlock{
		padding: 5px 0 50px 0;
	}
	.titleTab{
		margin-left: 15px;
	}
	.noOrder{
		color: #757575;
		text-align: center;
		font-size: 16px;
		padding-bottom: 28px;
	}
	.orderBottom{
		border: 1px dashed #757575;
		margin: 0 -15px 0 -15px;
	}
	.mainOrderBlock{
		margin: 13px 15px 0 15px;
		display: block;
		color: black;
	}
	.orderManagerBlock{
		display: flex;
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
	.orderNumberAndPrice{
		font-size: 14px;
	}
	.orderNumberAndPrice span:nth-child(2){
		display: inline-block;
		float: right;
		color: #26C281;
	}
	.noGoods{
		text-align: center;
		font-size: 30px;
		line-height: 250px;
		color: #f54646;
	}
	.loadLogoBlock{
		padding: 30px 0;
		color: #868686;
		text-align: center;
		background-color: white;
		display: grid;
		height: 280px;
		place-content: center;
	}
	.loadLogoBlock span{
		margin-top: 20px;
		display: block;
	}
	.loadLogoBlock img{
		width: 70px;
		margin: 0 auto;
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
		height: 30px;
	}
	.socBlock img{
		width: 30px;
	}
	.btnProfile{
		margin: 15px 0;
		color: black;
		text-decoration: none;
		display: block;
	}
	.btnProfile img{
		width: 22px;
		margin: 0 10px;
	}
	.blockBtnProfile{
		padding-bottom: 10px;
		margin-bottom: 10px;
		border-bottom: 1px dashed #757575;
	}
</style>
