<template lang="pug">
	div.slider
		span.countSlider(v-if="good.img.length>1") {{slideIndex}}/{{good.img.length}}
		.likeGood(@click="$_vtr_product_like" v-if="good.company.id!==$store.state.user.data.id_company")
			img(:src="likeActive?images.likeActive:images.like" ref="imageLike")
		router-link.mainBlockGood(:to="{ path: hrefLink, query: { pageName: pageName }}")
			div(v-if="good.img.length>0")
				.blockImg( v-if="good.img.length===1")
					img(:src="$store.state.user.settings.server+'company/'+good.company.id+'/'+good.img[0]")
				agile(:options="sliderProduct" @after-change="$vtr_product_slideIndex" v-else-if="good.img.length>1" ref="sliderProduct")
					.blockImg(v-for="img in good.img")
						img(:src="$store.state.user.settings.server+'company/'+good.company.id+'/'+img")
			.noPhoto(v-else)
				img(src="../../assets/loadLogo.svg")
				span Фото отсутствует
			.contentGood
				.nameGood
					span {{good.name}}
				.descriptionGood
					p {{good.description.substr(0,100)}}
						span ... Подробнее
				.priceBlock {{good.date}}
</template>

<script>
	import like from '../../assets/goodsImg/like.svg'
	import likeActive from '../../assets/goodsImg/likeActive.svg'
	import { VueAgile } from 'vue-agile'
	export default {
		props:{
			hrefLink:String,
			pageName:String,
			good:Object
		},
		data(){
			return{
				images:{
					like:like,
					likeActive:likeActive
				},
				likeActive:false,
				sliderProduct: {
					navButtons: false,
					dots: false,
					slidesToShow: 1,
				},
				slideIndex:0,
			}
		},
		activated() {
			if(this.good.img.length>1){
				this.$refs.sliderProduct.reload()
			}
		},
		created() {
			this.likeActive=this.$store.getters.watchFavoritGood(this.good.id)
		},
		methods:{
			async $_vtr_product_like(){
				let data=await this.$store.getters.request('PUT',this.$store.state.user.settings.server+'goods/favorites',{id:this.good.id})
				if(data&&!data.err){
					this.likeActive=!this.likeActive;
					this.$store.commit('editFavorits',this.good.id);
					this.$refs.imageLike.classList.add('sizeImgBtn');
					setTimeout(()=> {this.$refs.imageLike.classList.remove('sizeImgBtn')}, 700);
				}
			},
			$vtr_product_slideIndex(index){
				this.slideIndex=index.currentSlide+1;
			}
		},
		components: {
			agile: VueAgile
		},
	}
</script>

<style scoped>
	.noPhoto{
		padding: 30px 0;
		color: #868686;
		text-align: center;
		background-color: white;
		display: block;
	}
	.noPhoto span{
		margin-top: 20px;
		display: block;
	}
	.noPhoto img{
		width: 70px;
	}
	.slider{
		position: relative;
	}
	.likeGood{
		position: absolute;
		z-index: 1;
		width: 25px;
		margin-top: 15px;
		margin-left: 10px;
	}
	.countSlider{
		color: white;
		position: absolute;
		float: right;
		z-index: 1;
		right: 10px;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 15px;
		width: 40px;
		text-align: center;
		margin-top: 10px;
		font-size: 12px;
		padding: 2px;
	}
	.mainBlockGood{
		margin-bottom: 15px;
		color: black;
		text-decoration: none;
	}
	.blockImg{
		width: 100%;
		height: 200px;
		background: #DEDEDE;
	}
	.blockImg img{
		height: 200px;
		width: auto;
		top: 50%;
		position: relative;
		transform: translate(0, -50%);
		margin: 0 auto;
		display: block;
		max-width: 100%;
	}
	.contentGood{
		margin: 2px 15px;
	}
	.nameGood{
		font-size: 16px;
	}
	.descriptionGood p{
		color: #757575;
		margin-bottom: 5px;
	}
	.descriptionGood span{
		color: #F64646;
	}
	.priceBlock{
		font-size: 16px;
		color: #757575;
		text-align: right;
		width: 100%;
	}
</style>
