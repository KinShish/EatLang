<template lang="pug">
	div
		div(v-if="$route.name==='searchPageCat'")
			.activeCat
				span {{allCats.filter(item=>item.id===catActive)[0].name}}
				router-link(to="/search")
					img(src="../../assets/close.svg")
			.tabCat
				router-link(:to="''+cat.id" v-for="cat in allCats.filter(item=>item.id_parent===this.$route.params.idCat*1)" :key="cat.id") {{cat.name}}
			div(v-for="good in arrayGood" :key="good.id")
				router-link.infoGoodUser(:to="'search/company/'+good.company.id")
					img(:src="$store.state.user.settings.server+'company/'+$store.state.user.data.id_company+'/up/logo.jpg'" v-if="good.company.logo")
					span.logoName(v-else) {{good.company.name[0]}}
					span {{good.company.name}}
				VtrAdditionalProduct(:good="good" :hrefLink="'searchPageCat/good/'+good.id" :pageName="'Поиск'")
			b-spinner.customSpiner(variant="danger" v-if="!load&&!stopLoad")
		transition(name="opacity")
			router-view(:key="$route.fullPath")
</template>

<script>
	export default {
		data(){
			return{
				allCats:[],
				arrayGood:[],
				goodDate:1,
				catActive:0,
				load:true,
				stopLoad:false,
				array_id_cat:[],
			}
		},
		methods:{
			$_vtr_search_goToSearchPage(){
				this.$parent.searchActive=false
			},
			$_vtr_search_cat_getCats(){
				this.catActive=this.$route.params.idCat*1;
				this.array_id_cat=[];
				const getChildrenCat=(id)=>{
					let flag=true;
					this.allCats.forEach(cat=>{
						if(cat.id_parent===id){
							getChildrenCat(cat.id)
							flag=false;
						}
					})
					if(flag){this.array_id_cat.push(id)}
				}
				getChildrenCat(this.catActive)
				this.load=false;
				this.$_vtr_search_cat_loadGood();
			},
			$_vtr_search_cat_loadGood:async function(){
				if(this.$route.name==='searchPageCat'&&this.catActive!==this.$route.idCat&&!this.load){
					console.log(this.$store.state.user.settings.server+'goods/cat/'+this.goodDate)
					let data=await this.$store.getters.request('POST',this.$store.state.user.settings.server+'goods/cat/'+this.goodDate, {array_id_cat:this.array_id_cat})
					if(data&&!data.err){
						this.load=true;
						if(data.goods.length>0){
							this.arrayGood=this.arrayGood.concat(data.goods);
							this.goodDate=Date.parse(new Date(this.arrayGood[this.arrayGood.length - 1].updateGoods.replace( /(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")));
						}
						this.stopLoad=data.goods.length===0;
					}
				}
			}
		},
		created() {
			this.allCats=this.$store.state.user.cats;
			this.$_vtr_search_cat_getCats();
			this.$root.$on('lazyLoad', (res)=>{
				if(res&&this.load&&!this.stopLoad){
					this.load=false;
					this.$_vtr_search_cat_loadGood()
				}
			});
		},
		watch:{
			'catActive'(){
				this.arrayGood=[]; this.goodDate=1;
			},
			'$route.params.idCat'(){
				if(this.$route.name==='searchPageCat'&&this.catActive!==this.$route.idCat){
					this.$_vtr_search_cat_getCats();
				}
			}
		},
		components:{
			'VtrAdditionalProduct':()=>import('../additional/VtrAdditionalProduct'),
		},
	}
</script>

<style scoped>
	.activeCat{
		margin-left: 10px;
		margin-top: 5px;
	}
	.activeCat img{
		margin-left: 5px;
		height: 11px;
	}
	.header{
		padding: 5px;
	}
	.headerActive{
		background: rgba(0, 0, 0,0) !important;
		position: unset !important;
	}
	.noBorder{
		border-color: #f7f7f7;
		z-index: 2;
		position: relative;
		background: #f7f7f7;
	}
	.borderInput{
		margin: 5px auto;
		width: 95%;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		display: flex;
		padding: 0 5px;
	}
	.back{
		margin-top: 5px;
		margin-right: 5px;
	}
	.header input {
		height: 27px;
		border:none;
		box-shadow: none;
		outline: none;
		background: #f7f7f7;
	}
	.filterImg{
		padding: 6px 0;
		outline: none;
	}
	.searchBtn{
		background: #F64646;
		border-radius: 3px;
		padding: 0 5px;
		color: white;
		text-decoration: none;
		outline: none;
		font-size: 12px;
		display: block;
		height: 22px;
		margin-top: 3px;
		line-height: 23px;
	}
	.tabCat{
		overflow-x: scroll;
		width: 100%;
		display: flex;
		padding: 13px 0;
		font-size: 14px;
	}
	.tabCat a{
		background: #FFFFFF;
		color: #F64646;
		box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
		border-radius: 14px;
		padding: 3px 10px;
		height: 32px;
		margin: 0 5px;
		text-align: center;
		white-space: nowrap;
		line-height: 27px;
		text-decoration: none;
	}
</style>
