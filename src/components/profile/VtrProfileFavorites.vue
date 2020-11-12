<template lang="pug">
	div
		div(v-if="$route.name==='favorites'")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span(@click="$_vtr_favorites_loadGoods") Избранное
			.greyBlock
				div(v-for="good in goods" :key="good.id")
					router-link.infoGoodUser(:to="'/company/'+good.company.id")
						img(:src="$store.state.user.settings.server+'company/'+good.company.id+'/up/logo.jpg'" v-if="good.company.logo")
						span.logoName(v-else) {{good.company.name[0]}}
						span {{good.company.name}}
					VtrAdditionalProduct(:good="good" :hrefLink="'/good/'+good.id" :pageName="'Избранное'")
				b-spinner.customSpiner(variant="danger" v-if="!load&&!stopLoad&&!noFavorit")
				.noGoods(v-if="noFavorit") Тут пусто :(
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
				goods:[],
				noFavorit:false,
			}
		},
		methods:{
			async $_vtr_favorites_loadGoods(){
				if(this.$route.name==='favorites'&&!this.load){
					let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/favorites/'+this.dateGood)
					if(data&&!data.err){
						this.load=true;
						if(!data.err&&!this.stopLoad){
							this.goods=this.goods.concat(data.goods);
							this.noFavorit=this.goods.length===0&&data.goods.length===0
							if(data.goods.length>0){
								this.dateGood=Date.parse(new Date(this.goods[this.goods.length - 1].update.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")));
							}
						}
						this.stopLoad=data.goods.length===0||this.goods.length<=10;
					}else{
						this.$router.go(-1);
						this.$store.commit('notification','Прозошла ошибка, попробуйте позже')
					}
				}
			},
		},
		beforeRouteLeave(to,form,next) {
			if(!(to.name==='good'||to.name==='company')){
				this.$destroy()
			}
			next()
		},
		created() {
			this.load=false;
			this.$_vtr_favorites_loadGoods();
			this.$root.$on('lazyLoad', (res)=>{
				if(res&&this.load&&!this.stopLoad){
					this.load=false;
					this.$_vtr_favorites_loadGoods()
				}
			});
		},
		components:{
			'VtrAdditionalProduct':()=>import('../additional/VtrAdditionalProduct'),
		},
	}
</script>

<style scoped>
	.greyBlock{
		margin-top: 15px;
	}
	.noGoods{
		text-align: center;
		font-size: 30px;
		line-height: 250px;
		color: #f54646;
	}
</style>
