<template lang="pug">
	router-link.mainBlockGood(:to="{ path: hrefLink, query: { pageName: pageName }}")
		.slider
			span.countSlider(v-if="good.img[0]!==''") {{slideIndex}}/{{good.img.length}}
			agile(:options="sliderProduct" @after-change="$vtr_product_slideIndex" v-if="good.img[0]!==''")
				.blockImg(v-for="item in good.img")
					img(src="https://img01.flagma.ru/photo/uslugi-spectehniki-spectehnika-v-arendu-5114258_big.jpg")
			.noPhoto(v-else)
				img(src="../../assets/loadLogo.svg")
				span Фото отсутствует
		.contentGood
			.statGoodsBlock
				img(src="../../assets/goodsImg/eye.svg")
				span 320
				span    +21
			.statGoodsBlock
				img(src="../../assets/goodsImg/heart.svg")
				span 320
			.nameGood
				span {{good.name}}
			.descriptionGood
				p {{good.description.substr(0,100)}}
					span ... Подробнее
			.priceBlock
				//span {{good.price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,'$1' + ' ')+' ₽'}}
				span {{good.date}}
</template>

<script>
	import { VueAgile } from 'vue-agile'
	export default {
		props:{
			hrefLink:String,
			pageName:String,
			good:Object
		},
		data(){
			return{
				likeActive:false,
				sliderProduct: {
					navButtons: false,
					dots: false,
					slidesToShow: 1,
				},
				slideIndex:0,
			}
		},
		methods:{
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
		height: auto;
		max-width: 100%;
		top: 50%;
		position: relative;
		transform: translate(0, -50%);
		margin: 0 auto;
		display: block;
	}
	.contentGood{
		margin: 2px 15px 13px 15px;
	}
	.statGoodsBlock{
		display: inline-block;
		margin-right: 15px;
		color: #757575;
	}
	.statGoodsBlock span:nth-child(3){
		color: #3cc281;
	}
	.statGoodsBlock img{
		margin-right: 5px;
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
	}
	.priceBlock span:nth-child(1){
		color: #26c281;
	}
	.priceBlock span:nth-child(2){
		color: #757575;
		float: right;
		text-align: right;
	}
</style>
