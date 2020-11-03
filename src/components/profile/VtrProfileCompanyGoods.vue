<template lang="pug">
	div
		div(v-if="$route.name==='companyGoods'")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span {{$store.state.user.company.name}}
			.customTabsProfile
				b-card(no-body)
					b-tabs(pills card)
						b-tab(title='АКТИВНЫЕ' active @click="$_vtr_profile_clickTab(1)")
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
		transition(name="opacity")
			router-view
</template>

<script>
	export default {
		data(){
			return{
				goodsArray:{
					goods:{
						'0':[],
						'1':[],
						'2':[],
						'3':[],
					},
					date:{
						'0':1,
						'1':1,
						'2':1,
						'3':1,
					}
				},

				status:1,
				load:true,
				stopLoad:false,
			}
		},
		created() {
			this.load=false;
			this.vtr_profile_companyGoods_loadGoods();
			this.$root.$on('lazyLoad', (res)=>{
				if(res&&this.load&&!this.stopLoad){
					this.load=false;
					this.vtr_profile_companyGoods_loadGoods()
				}
			});
		},
		methods:{
			$_vtr_profile_clickTab(status){
				if(this.status!==status){
					this.status=status;
					this.load=false;
					this.goodsArray.goods[status]=[];
					this.goodsArray.date[status]=1;
					this.vtr_profile_companyGoods_loadGoods();
					this.stopLoad=false;
				}
			},
			async vtr_profile_companyGoods_loadGoods(){
				if(this.$route.name==='companyGoods'&&!this.load){
					let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/company/'+this.$store.state.user.data.id_company+'/'+this.status+'/'+this.goodsArray.date[this.status])
					if(data){
						this.load=true;
						if(!data.err&&data.rights&&!this.stopLoad){
							this.goodsArray.goods[this.status]=this.goodsArray.goods[this.status].concat(data.goods);
							if(data.goods.length>0){
								this.goodsArray.date[this.status]=Date.parse(new Date(this.goodsArray.goods[this.status][this.goodsArray.goods[this.status].length - 1].update.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")));
							}
						}
						this.stopLoad=(data.goods.length===0);
					}
				}
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
