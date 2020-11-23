<template lang="pug">
	div
		div(v-if="goods.length!==0")
			.header
				img.back(src="../../assets/back.svg" @click="$router.go(-1)")
				span.title {{$route.query.pageName}}
				.buttonsGood
					//img(src="../../assets/goodsImg/share.svg")
					//img(src="../../assets/goodsImg/compare.svg")
					router-link(:to="'/edit/'+$route.params.idGood" v-if="$store.state.user.data.id_company===goods.company.id")
						img(src="../../assets/goodsImg/edit.svg")
				//b-dropdown(no-caret right).hamburgerButtonDropDown
					template(v-slot:button-content)
						.hamburgerButton
							span .
							span .
							span .
					b-dropdown-item(href='#' v-if="$store.state.user.data.id_company===goods.company.id") Добавить в архив
					b-dropdown-item(href='#' v-if="$store.state.user.data.id_company===goods.company.id") Поднять в списке
					b-dropdown-item(href='#') Пожаловаться
			.slider
				span.countSlider(v-if="goods.img.length>1") {{slideIndex}}/{{goods.img.length}}
				.likeGood(@click="$_vtr_good_like" v-if="$store.state.user.data.id_company!==goods.company.id")
					img(:src="likeActive?images.likeActive:images.like" ref="imageLikeGood")
				div(v-if="goods.img.length>0")
					.blockImg(v-if="goods.img.length===1")
						img(:src="$store.state.user.settings.server+'company/'+goods.company.id+'/'+goods.img[0]" @click="$_vtr_good_modalSlider(1,0)")
					agile(:options="sliderProduct" @after-change="$_vtr_good_index_slideIndex" v-else-if="goods.img.length>1")
						.blockImg(v-for="(img,index) in goods.img")
							img(:src="$store.state.user.settings.server+'company/'+goods.company.id+'/'+img" @click="$_vtr_good_modalSlider(1,index)")
				.noPhoto(v-else)
					img(src="../../assets/loadLogo.svg")
					span Фото отсутствует
			.greyBlock
				.statGoodsIndexBlock
					div
						img(src="../../assets/goodsImg/eye.svg")
						span 320
						span +21
					div
						img(src="../../assets/goodsImg/heart.svg")
						span 320
					div
						span {{goods.date}}
				.blockBorder
					.nameIndexGood {{goods.name}}
					.priceIndexGood {{price==='Показать цену'?price:price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,'$1' + ' ')+' ₽'}}
				//.blockBorder
					span.watchGeoGood Показать местоположение
				.blockBorder
					.titleGoodSpan Описание
					.descriptionGoodIndex {{goods.description}}
				//.blockBorder
					.titleGoodSpan Характеристики
					.specifications
						.lineSpec
							span Страна производитель
							span Япония
						.lineSpec
							span Марка
							span Hinomoto
						.lineSpec
							span Тип привода
							span колесный,4WD
						.lineSpec
							span Мощность
							span 24 л.с.
						.lineSpec
							span Максимальная скорость
							span 20 км\ч
						.lineSpec
							span Прочее
							span фары,указатели поворотов
						.lineSpec
							span Минимальный радиус разворота
							span 24 л.с.
						.lineSpec
							span Габариты
							span 260*135*140 (длина*ширина*высота)
						.lineSpec
							span Покраска
							span покрашен
				//button.btnRed Добавить к сравнению
				//button.btnAuction Перейти в аукцион
			.userBlock(v-if="$store.state.user.data.id_company!==goods.company.id")
				.fastButtonBlock
					.imgUser(v-if="goods.company.logo")
						img(:src="$store.state.user.settings.server+'company/'+goods.company.id+'/up/logo.jpg'")
					span.logoName(v-else) {{goods.company.name[0]}}
					router-link(:to="'/company/'+goods.company.id") {{goods.company.name}}
			.fastBtnGood(v-if="$store.state.user.data.id_company!==goods.company.id")
				.fastButtonBlock
					//router-link(:to="'/call/'+1001").fastButton Позвонить
					button.fastButton(@click="$_vtr_good_message") Написать
			transition(name="opacity")
				.modalPhoto(v-if="photoModal")
					.agileBlock
						div(v-if="imgModal.length>1")
							v-zoomer-gallery(v-model="sliderModal" :list="imgModal")
						.agileBlockSolo(v-else)
							v-zoomer
								img(:src="$store.state.user.settings.server+'company/'+goods.company.id+'/'+goods.img[0]")
					.btnCloseModal
						span(@click="$_vtr_good_modalSlider(0)") Закрыть
			transition(name="opacity")
				router-view
		.spinerBlock(v-else)
			b-spinner.customSpiner(variant="danger")
</template>

<script>
	import like from '../../assets/goodsImg/like.svg'
	import likeActive from '../../assets/goodsImg/likeActive.svg'
	import { VueAgile } from 'vue-agile'
	export default {
		data(){
			return{
				price:'Показать цену',
				goods:[],
				images:{
					like:like,
					likeActive:likeActive
				},
				likeActive:false,
				sliderProduct: {
					navButtons: false,
					dots: false,
					slidesToShow: 1,
					infinite:false,
					initialSlide:0,
				},
				photoModal:false,
				imgModal: [],
				sliderModal:1,
				slideIndex:0,
			}
		},
		activated() {
			this.$_vtr_good_loadGood();
		},
		methods:{
			$_vtr_good_modalSlider(type,index){
				if(type){
					this.imgModal=[];
					this.goods.img.forEach(img=>{
						this.imgModal.push(this.$store.state.user.settings.server+'company/'+this.goods.company.id+'/'+img)
					})
					this.photoModal=true;
					this.sliderModal=index;
				}else{
					this.photoModal=false;
					this.imgModal=[];
					this.sliderModal=0;
				}
			},
			async $_vtr_good_message(){
				this.$store.getters.createRoom({
					goods:{
						id:this.$route.params.idGood,
						img:this.goods.img.length>0?this.goods.img[0]:'',
						name:this.goods.name,
						price:this.price,
					},
					id_company:this.goods.company.id,
				},res=> {
					if(!res.err){
						this.$router.push('/chat/dialog/' + res.key)
					}
				})
			},
			async $_vtr_good_loadPrice(){
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/'+this.$route.params.idGood+'/price')
				if(!data.err){
					this.price=data.price;
				}
			},
			async $_vtr_good_loadGood(){
				this.goods=[];
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/'+this.$route.params.idGood)
				if(data&&!data.err){
					this.goods=data.good;
					this.likeActive=this.$store.getters.watchFavoritGood(this.goods.id)
				}else{
					this.$router.go(-1);
					this.$store.commit('notification','Прозошла ошибка, попробуйте позже')
				}
				this.$_vtr_good_loadPrice();
			},
			async $_vtr_good_like(){
				let data=await this.$store.getters.request('PUT',this.$store.state.user.settings.server+'goods/favorites',{id:this.goods.id})
				if(data&&!data.err){
					this.likeActive=!this.likeActive
					this.$store.commit('editFavorits',this.goods.id);
					this.$refs.imageLikeGood.classList.add('sizeImgBtn');
					setTimeout(()=> {this.$refs.imageLikeGood.classList.remove('sizeImgBtn')}, 700);
				}
			},
			$_vtr_good_index_slideIndex(index){
				this.slideIndex=index.currentSlide+1;
			}
		},
		components: {
			agile: VueAgile
		},
	}
</script>

<style scoped>
	/*модальное окно слайдера фотографий начало*/
	.btnCloseModal{
		position: absolute;
		width: 100%;
		bottom: 10px;
	}
	.btnCloseModal span{
		display: block;
		margin: 0 auto;
		width: -webkit-fit-content;
		width: -moz-fit-content;
		width: fit-content;
		background: rgb(255 0 0 / 62%);
		padding: 5px 10px;
		border-radius: 10px;
		color: white;
		cursor: pointer;
	}
	.imgAgileBlock{
		width: 100% !important;
	}
	.agileBlockSolo img{
		top: 50%;
		position: relative;
		transform: translateY(-50%);
	}
	.agileBlock{
		top: 50%;
		transform: translateY(-50%);
		position: relative;
		height: 100%;
	}
	.agileBlock div{
		height: 100%;
		background: rgba(0, 0, 0, 0) !important;
		max-width: 600px;
		margin: 0 auto;
	}
	.modalPhoto{
		background: rgba(0, 0, 0, 0.23);
		box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		padding: 0 7px;
		display: grid;
	}
	.modalPhoto img{
		width: 100%;
		height: auto;
		max-width: 600px;
		margin: 0 auto;
		display: block;
		position: relative;
	}
	/*модальное окно слайдера фотографий конец*/
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
	.header .back{
		height: 100%;
		display: block;
		min-width: 20px;
	}
	.header{
		display: flex;
	}
	.header .title{
		display: inline-block;
		/* margin-left: 20px; */
		white-space: nowrap;
		overflow: hidden;
		padding-right: 5px;
		flex: auto;
		text-overflow: ellipsis;
	}
	.buttonsGood{
		display: inline-flex;
		float: right;
		height: 50px;
	}
	.buttonsGood a{
		display: flex;
	}
	.buttonsGood img{
		margin: 0 5px;
	}
	.hamburgerButton{
		display: block;
		float: right;
		line-height: 23px;
		margin-left: 20px;
		height: 50px;
		padding: 0 5px;
		margin-right: 5px;
		right: -10px;
		position: relative;
	}
	.hamburgerButton span{
		font-weight: bolder;
		display: list-item;
		height: 7px;
		list-style: none;
		font-size: 25px;
	}
	.priceIndexGood{
		font-weight: bold;
		font-size: 20px;
		line-height: 23px;
		text-decoration-line: underline;
		color: #26C281;
		margin-bottom: 10px;
	}
	.slider{
		position: relative;
		z-index: 0;
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
		margin-top: 15px;
		font-size: 12px;
		padding: 2px;
	}
	.fastButton{
		display: block;
		outline: none;
		border: 2px solid #F64646;
		background: #F64646;
		color: white;
		border-radius: 3px;
		padding: 5px 10px;
		font-size: 16px;
		margin: 0 auto;
		width: 45%;
	}
	.userBlock{
		position: fixed;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
		bottom: 90px;
	}
	.userBlock .fastButtonBlock{
		line-height: 60px;
	}
	.userBlock .logoName{
		margin-left: 0;
		width: 60px;
		height: 60px;
		display: grid;
		place-content: center;
		font-size: 40px;
	}
	.userBlock a{
		color: #757575 !important;
	}
	.imgUser{
		width: 60px;
		height: 60px;
		display: grid;
		place-content: center;
		margin-right: 10px;
		border-radius: 50%;
		overflow: hidden;
		background: #dedede;
	}
	.imgUser img{
		width: 100%;
		height: auto;
	}
	.fastBtnGood{
		position: fixed;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
		bottom: 25px;
	}
	.fastButtonBlock{
		padding: 7px;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		width: 95%;
		margin: 0 auto;
		max-width: 600px;
		text-align: center;
		display: flex;
	}
	.fastButtonBlock a{
		color: white;
		text-decoration: none;
	}
	.btnAuction{
		display: block;
		outline: none;
		border: 2px solid #26C281;
		background: #26C281;;
		color: white;
		border-radius: 3px;
		padding: 5px 50px;
		font-size: 16px;
		width: 100%;
		margin-bottom: 50px;
	}
	.btnRed{
		width: 100%;
		margin: 10px auto;
		display: block;
	}
	.titleGoodSpan{
		font-size: 14px;
		display: block;
		color: #333333;
		font-weight: bolder;
	}
	.blockBorder{
		margin-top: 10px;
		border-bottom: 1px dashed #757575;
	}
	.blockImg{
		width: 100%;
		height: 200px;
		background: #DEDEDE;
		display: grid;
		place-content: center;
	}
	.blockImg img{
		max-height: 200px;
		height: auto;
		max-width: 100%;
	}
	.greyBlock{
		margin: 0 15px;
	}
	.statGoodsIndexBlock{
		display: flex;
		color: #757575;
	}
	.statGoodsIndexBlock div{
		margin: 0 auto;
	}
	.statGoodsIndexBlock div:first-child{
		margin-left: 0;
	}
	.statGoodsIndexBlock div:last-child{
		margin-right: 0;
	}
	.statGoodsIndexBlock div:nth-child(1) span:nth-child(3){
		color: #3cc281;
		margin-left: 5px;
	}
	.statGoodsIndexBlock img{
		margin-right: 5px;
		margin-bottom: 4px;
	}
	.nameIndexGood{
		font-size: 16px;
		font-weight: bold;
	}
	.watchGeoGood{
		text-decoration: underline;
		font-size: 14px;
		color: #F64646;
		margin-bottom: 10px;
		display: block;
	}
	.descriptionGoodIndex{
		font-size: 14px;
		text-align: justify;
		color: #757575;
		line-height: 16px;
		margin: 10px 0;
	}
	.specifications{
		color: #757575;
		font-size: 14px;
	}
	.lineSpec{
		display: flex;
	}
	.lineSpec span{
		flex: 1;
	}
	.lineSpec span:nth-child(2){
		text-align: right;
	}
</style>
