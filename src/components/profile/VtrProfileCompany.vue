<template lang="pug">
	div
		div(v-if="$route.name==='company'")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span {{company.name}}
			.logoBlock
				img(src="../../assets/loadLogo.svg")
				span Фото отсутствует
			button.btnRed(@click="$_vtr_profile_company_subscribe" :class="subActive?'subActive':''") {{subActive?'Вы подписаны':'Подписаться'}}
			button.btnRed Контакты компании
			.title Объявления пользователя
			.noGoods(v-if="goods.length===0") Тут пусто :(
			VtrAdditionalProduct(v-else v-for="good in goods" :key="good.id+'company'" :good="good" :hrefLink="$route.params.idComp+'/good/'+good.id" :pageName="good.company.name")
			b-spinner.customSpiner(variant="danger" v-if="load&&!stopLoad")
		transition(name="opacity")
			router-view
</template>

<script>
	export default {
		data(){
			return{
				load:true,
				stopLoad:false,
				number:1,
				goods:[],
				subActive:false,
				company:[],
				subscriptions:[],
			}
		},
		components:{
			'VtrAdditionalProduct':()=>import('../additional/VtrAdditionalProduct'),
		},
		methods:{
			$_vtr_profile_company_subscribe:async function(){
				let data=await this.$store.getters.request('POST',this.$store.state.user.settings.server+'subscription',{id:this.$route.params.idComp})
				if(!data.err){
					this.subActive=!this.subActive;
					this.$store.commit('notification',data.text)
				}
			},
			$_vtr_profile_company_loadGoods:async function(){
				if(this.$route.name==='company'&&!this.load){
					let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'/company/'+this.$route.params.idComp+'/1/'+this.number)
					if(data&&!data.err){
						this.load=true;
						if(!data.err&&!this.stopLoad){
							this.goods=this.goods.concat(data.goods)
							this.number++;
						}
						this.stopLoad=(data.goods.length===0);
					}
				}
			},
			$_vtr_profile_company_loadCompany:async function(){
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'company/'+this.$route.params.idComp)
				if(data&&!data.err){
					this.company=data.company;
					this.subscriptions=data.subscriptions;
					this.subActive=(this.subscriptions.indexOf(this.$store.state.user.data.id)>-1)
				}
			}
		},
		created() {
			this.load=false;
			this.$_vtr_profile_company_loadCompany();
			this.$_vtr_profile_company_loadGoods();
			this.$root.$on('lazyLoad', (res)=>{
				if(res&&this.load&&!this.stopLoad){
					this.load=false;
					this.$_vtr_profile_company_loadGoods()
				}
			});
		}
	}
</script>

<style scoped>
	.subActive{
		background: white;
		color: #F64646;
		transition: .3s ease;
	}
	.noGoods{
		text-align: center;
		font-size: 30px;
		line-height: 250px;
		color: #f54646;
	}
	.title{
		font-size: 18px;
		font-weight: bold;
		color: #333333;
		margin-left: 2.5%;
		margin-top: 20px;
	}
	.btnRed{
		width: 95%;
		margin: 5px auto;
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
</style>
