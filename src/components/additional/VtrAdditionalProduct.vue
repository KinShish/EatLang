<template lang="pug">
	div
		span.countSlider(v-if="good.img[0]!==''") {{slideIndex}}/{{good.img.length}}
		.likeGood(@click="$_vtr_product_like")
			img(:src="likeActive?images.likeActive:images.like" ref="imageLike")
		router-link.mainBlockGood(:to="{ path: hrefLink, query: { pageName: pageName }}")
			.slider
				agile(:options="sliderProduct" @after-change="$vtr_product_slideIndex"  v-if="good.img[0]!==''")
					.blockImg(v-for="item in good.img")
						img(src="https://img01.flagma.ru/photo/uslugi-spectehniki-spectehnika-v-arendu-5114258_big.jpg")
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
				price:'600000',
				string:'это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.'
			}
		},
		methods:{
			$_vtr_product_like(){
				this.likeActive=!this.likeActive
				this.$refs.imageLike.classList.add('sizeImgBtn');
				setTimeout(()=> {this.$refs.imageLike.classList.remove('sizeImgBtn')}, 700);
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
		height: auto;
		max-width: 100%;
		top: 50%;
		position: relative;
		transform: translate(0, -50%);
		margin: 0 auto;
		display: block;
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
