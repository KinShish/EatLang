<template lang="pug">
	div
		div(v-if="$route.name==='companyGoods'")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span Объявления компании
			.customTabsProfile
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
		transition(name="opacity")
			router-view
</template>

<script>
	export default {
		data(){
			return{
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
		created() {
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
					this.vtr_profile_companyGoods_loadGoods();
					this.stopLoad=false;
				}
			},
			vtr_profile_companyGoods_loadGoods:async function(){
				if(this.$route.name==='companyGoods'){
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
