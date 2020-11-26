<template lang="pug">
	div
		div(v-if="$route.name==='feed'")
			.header
				img.back(src="../assets/back.svg" @click="$router.go(-1)" v-if="$route.name!=='feed'")
				span Лента объявлений
			.whiteBlock
				div(v-for="good in goods" :key="good.id")
					router-link.infoGoodUser(:to="'/company/'+good.company.id")
						img(:src="$store.state.user.settings.server+'company/'+$store.state.user.data.id_company+'/up/logo.jpg'" v-if="good.company.logo")
						span.logoName(v-else) {{good.company.name[0]}}
						span {{good.company.name}}
					VtrAdditionalProduct(:good="good" :hrefLink="'/good/'+good.id" :pageName="'Лента объявлений'")
				b-spinner.customSpiner(variant="danger" v-if="!load&&!stopLoad")
				p.noOrder(v-if="goods.length===0&&stopLoad") Тут пусто :(
		transition(name="opacity")
			router-view
</template>

<script>
	export default {
		data(){
			return{
				load:true,
				stopLoad:false,
				dateGood:1,
				goods:[]
			}
		},
		components:{
			'VtrAdditionalProduct':()=>import('./additional/VtrAdditionalProduct'),
		},
		methods:{
			async $_vtr_feed_loadGoods(){
				if(this.$route.name==='feed'&&!this.load){
					let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/feed/'+this.dateGood)
					if(data&&!data.err){
						this.load=true;
						if(!data.err&&!this.stopLoad){
							this.goods=this.goods.concat(data.goods);
							if(data.goods.length>0){
								this.dateGood=Date.parse(new Date(this.goods[this.goods.length - 1].update.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")));
							}
						}
						this.stopLoad=data.goods.length===0||this.goods.length<=10;
					}else{
						this.stopLoad=true;
						this.$store.commit('notification','Прозошла ошибка, попробуйте позже')
					}
				}
			}
		},
		beforeRouteLeave(to, from, next){
			if(!(to.name==='good'||to.name==='company')){
				this.goods=[];
				this.load=true;
				this.stopLoad=false;
				this.dateGood=1;
			}
			next();
		},
		activated() {
			this.load=false;
			this.$_vtr_feed_loadGoods();
			this.$root.$on('lazyLoad', (res)=>{
				if(res&&this.load&&!this.stopLoad){
					this.load=false;
					this.$_vtr_feed_loadGoods()
				}
			});
		}
	}
</script>

<style scoped>
	.whiteBlock{
		margin: 0 0 60px 0;
	}
	.noOrder{
		color: #757575;
		text-align: center;
		font-size: 24px;
		padding-top: 50%;
		background: #f7f7f7;
	}
</style>
