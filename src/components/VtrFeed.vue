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
								this.dateGood=Date.parse(new Date(this.goods[this.goods.length - 1].updateGoods.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")));
							}
						}
						this.stopLoad=data.goods.length===0;
					}
				}
			}
		},
		created() {
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
		margin: 0 0 15px 0;
	}
</style>
