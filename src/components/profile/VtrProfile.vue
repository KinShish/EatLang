<template lang="pug">
	div
		div(v-if="$route.name==='profile'")
			.header
				span {{$store.state.user.data.name}}
				img.exit(src="../../assets/exit.svg" @click="$store.commit('logout')")
			label.loadLogoBlock(for="laodlogoinp" v-if="$store.state.user.admin")
				img(src="../../assets/loadLogo.svg")
				span Загрузите логотип компании
				b-form-file#laodlogoinp.d-none(type="file" @input="$_vtr_profile_loadLogo(fileLogo)" v-model="fileLogo")
			.loadLogoBlock(v-else)
				img(src="../../assets/loadLogo.svg")
				span Фото отсутствует
			.blockBtnProfile
				.socialBlocks
					router-link.socBlock(to="/profile/favorites")
						div
							img(src="../../assets/favorits.svg")
							span ∞
						p Избранное
					router-link.socBlock(:to="$store.state.user.admin?'/profile/managers':'/profile/companyGoods'")
						div
							img(src="../../assets/managers.svg")
							span {{$store.state.user.admin?$store.state.user.managers.length:'∞'}}
						p {{$store.state.user.admin?'Менеджеры':'Объявления'}}
				router-link.btnProfile(to="profile/settings" v-if="$store.state.user.admin")
					img(src="../../assets/settings.svg")
					span Настройки профиля
				router-link.btnProfile(to="profile/notifications")
					img(src="../../assets/notifications.svg")
					span Уведомления
			.container(v-if="$store.state.user.admin")
				h4 Мои объявления
			.customTabsProfile(v-if="$store.state.user.admin")
				b-card(no-body)
					b-tabs(pills card)
						b-tab(title='АКТИВНЫЕ' active @click="$_vtr_profile_clickTab(1)")
							.customTabContent
								.noGoods(v-if="goodsActive.length===0") Тут пусто :(
								VtrAdditionalPrivateProduct(v-else v-for="good in goodsActive" :key="good.id" :good="good" :hrefLink="'profile/good/'+good.id" :pageName="'Личный кабинет'")
						b-tab(title='НА МОДЕРАЦИИ' @click="$_vtr_profile_clickTab(0)")
							.customTabContent
								.noGoods(v-if="goodsModer.length===0") Тут пусто :(
								VtrAdditionalPrivateProduct(v-else v-for="good in goodsModer" :key="good.id" :good="good" :hrefLink="'profile/good/'+good.id" :pageName="'Личный кабинет'")
						b-tab(title='АРХИВ' @click="$_vtr_profile_clickTab(3)")
							.customTabContent
								.noGoods(v-if="goodsArch.length===3") Тут пусто :(
								VtrAdditionalPrivateProduct(v-else v-for="good in goodsArch" :key="good.id" :good="good" :hrefLink="'profile/good/'+good.id" :pageName="'Личный кабинет'")
			.whiteBlock(v-else)
				.greyBlock
					h4 Заявки
					p.noOrder Заявок нет
				.mainOrderBlock(v-for="item in 5")
					.orderManagerBlock
						.orderBlockImg
							img(src="https://i.ytimg.com/vi/JqyPgG1hagY/maxresdefault.jpg")
						.orderBlockInfo
							span Название объявления Название объявления
							span Имя покупателя Имя покупателя
						span.orderDate  12.08.20
					.orderNumberAndPrice
						span Заказ №12
						span 600 000
					hr.orderBorder
				.greyBlock
					h4 Заврешенные
					p.noOrder Заявок нет
				.mainOrderBlock(v-for="item in 5")
					.orderManagerBlock
						.orderBlockImg
							img(src="https://i.ytimg.com/vi/JqyPgG1hagY/maxresdefault.jpg")
						.orderBlockInfo
							span Название объявления Название объявления
							span Имя покупателя Имя покупателя
						span.orderDate  12.08.20
					.orderNumberAndPrice
						span Заказ №12
						span 600 000
					hr.orderBorder
		transition(name="opacity")
			router-view
</template>

<script>
	export default {
		data(){
			return{
				fileLogo:[],

				goodsActive:[],
				goodsModer:[],
				goodsArch:[],
				goodsBlock:[],

				numGoodsActive:1,
				numGoodsModer:1,
				numGoodsArch:1,
				numGoodsBlock:1,

				status:1,
				load:true,
				stopLoad:false,
			}
		},
		components:{
			'VtrAdditionalPrivateProduct':()=>import('../additional/VtrAdditionalPrivateProduct'),
		},
		created() {
			if(this.$store.state.user.admin){
				this.$_vtr_profile_loadGoods();
			}
			this.$root.$on('lazyLoad', (res)=>{
				if(res&&this.load&&!this.stopLoad){
					this.load=false;
					this.$_vtr_profile_loadGoods()
				}
			});
		},
		methods:{
			$_vtr_profile_clickTab(status){
				if(this.status!==status){
					this.status=status;
					this.$_vtr_profile_loadGoods();
					this.stopLoad=false;
				}
			},
			$_vtr_profile_loadGoods:async function(){
				if(this.$route.name==='profile'){
					let number;
					switch (this.status) {
						case 1:{
							number=this.numGoodsActive;
							break
						}
						case 0:{
							number=this.numGoodsModer;
							break
						}
						case 3:{
							number=this.numGoodsArch;
							break
						}
						case 2:{
							number=this.numGoodsBlock;
							break
						}
					}
					let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/company/'+this.$store.state.user.data.id_company+'/'+this.status+'/'+number)
					if(data){
						this.load=true;
						if(!data.err&&data.rights&&!this.stopLoad){
							//активные
							if(this.status===1){
								this.goodsActive=this.goodsActive.concat(data.goods);
								this.numGoodsActive++;
							}
							//модерация
							if(this.status===0){
								this.goodsModer=this.goodsModer.concat(data.goods);
								this.numGoodsModer++;
							}
							//архив
							if(this.status===3){
								this.goodsArch=this.goodsArch.concat(data.goods);
								this.numGoodsArch++;
							}
							//заблокированные
							if(this.status===2){
								this.goodsBlock=this.goodsBlock.concat(data.goods);
								this.numGoodsBlock++;
							}
						}
						this.stopLoad=(data.goods.length===0);
					}
					console.log(data)
				}
			},
			$_vtr_profile_loadLogo(file){
				if(file){
					if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(file.name)) {
						this.$store.commit('notification',"Файл  "+file.name+"  не поддерживается")
					}else{
						let data = new FormData();
						data.append('file', file);
						console.log(this.$store.getters.request('POST',this.$store.state.user.settings.server+'company/logo',data))
						//cd функцию у гетера попробуй сдлать
					}
				}
			}
		}
	}
</script>

<style scoped>
	.orderBorder{
		border: 1px dashed #757575;
	}
	.exit{
		float: right;
		line-height: 50px;
		display: block;
		margin: 15px 10px;
	}
	.whiteBlock{
		padding-bottom: 50px;
	}
	.whiteBlock h4{
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
		display: block;
		background: #DEDEDE;
		line-height: 40px;
		min-width: 50px;
		overflow: hidden;
		border-radius: 3px;
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
		display: block;
	}
	.loadLogoBlock span{
		margin-top: 20px;
		display: block;
	}
	.loadLogoBlock img{
		width: 70px;
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
