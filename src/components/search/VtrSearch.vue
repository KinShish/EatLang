<template lang="pug">
	div

		.header(v-if="$route.name!=='company'")
			.borderInput(:class="searchActive?'noBorder':''" style="z-index:2")
				img.back(src="../../assets/back.svg" @click="$router.go(-1)" v-if="$route.name!=='search'")
				b-form-input#inputSearch(v-model="search" placeholder="Поиск" @focus="searchActive=true")
				img.filterImg(src="../../assets/filter.svg" v-b-toggle.sidebarFilter v-if="!searchActive" @click="filterActive=true")
				.searchBtn(@click="searchActive=false" v-else) Найти
		div(v-if="$route.name==='search'")
			.listSearch(v-if="searchActive")
				div
					span(@click="search='История 1'") История 1
					span(@click="search='История 2'") История 2
					span(@click="search='История 3'") История 3
					span(@click="search='История 4'") История 4
			.whiteBlock
				.tabCat
					span АВТОМОБИЛИ
					span КВАДРОЦИКЛЫ
					span СТРОИТЕЛЬНАЯ ТЕХНИКА
					span АВТОМОБИЛИ
					span АВТОМОБИЛИ
					span КВАДРОЦИКЛЫ
					span СТРОИТЕЛЬНАЯ ТЕХНИКА
					span АВТОМОБИЛИ
					span АВТОМОБИЛИ
					span КВАДРОЦИКЛЫ
					span СТРОИТЕЛЬНАЯ ТЕХНИКА
					span АВТОМОБИЛИ
				.customTabsSearch
					b-card(no-body)
						b-tabs(pills card)
							b-tab(title='Рекомендуемое' active)
								.customTabContent
									div(v-for="item in 2" :key="item")
										router-link.infoGoodUser(:to="'search/company/'+item")
											img(src="https://alna.ru/up/services_img/1427/03058d059257409dfe70e596ad320c9726e2ec93.jpg")
											span Имя пользователя
										VtrAdditionalProduct(:hrefLink="'search/good/'+item")
							b-tab(title='Новые объявления')
								.customTabContent
									div(v-for="item in 2" :key="item")
										router-link.infoGoodUser(:to="'search/company/'+item")
											img(src="https://alna.ru/up/services_img/1427/03058d059257409dfe70e596ad320c9726e2ec93.jpg")
											span Имя пользователя
										VtrAdditionalProduct(:hrefLink="'search/good/'+item")
		.activeSearch(v-if="searchActive" @click="searchActive=false")
		b-sidebar#sidebarFilter(title='Уточнить' right no-header)
			.whiteBlock
				.headerSidebar
					img(src="../../assets/close.svg" v-b-toggle.sidebarFilter @click="filterActive=false")
					h4  Уточнить
				.blockFilter
					.boxShadowFilter
						.blockFilterCity
							label(for="cityFilterInp") Город
							input#cityFilterInp(placeholder="Славянск на кубани")
					.boxShadowFilter
						.priceFilterInputs
							label(for="priceFilterInp") Цена
							.priceFilterInputsContetn
								div
									span от
									input#priceFilterInp
								div
									span до
									input
					.boxShadowFilter
						b-form-radio-group.radioBtnFilter(
							v-model="selectedFilter"
							:options="optionsFilter")
					button.btnRed Показать объявления
		transition(name="opacity")
			router-view
</template>
<script>
	export default {
		data(){
			return{
				searchActive:false,
				filterActive:false,
				search:'',
				selectedFilter:0,
				optionsFilter:[
					{text:'По умолчанию',value:'0'},
					{text:'По дате',value:'1'},
					{text:'Сначала подешевле',value:'2'},
					{text:'Сначала подороже',value:'3'},
				]
			}
		},
		methods:{
			test(e){
				console.log(e)
			}
		},
		watch:{
			'searchActive'(){
				if(this.searchActive){
					document.body.style.cssText="overflow:hidden";
				}else{
					document.body.style.cssText="overflow:auto";
				}
			},
			'filterActive'(){
				if(this.filterActive){
					document.body.style.cssText="overflow:hidden";
				}else{
					document.body.style.cssText="overflow:auto";
				}
			}
		},
		components:{
			'VtrAdditionalProduct':()=>import('../additional/VtrAdditionalProduct'),
		},
	}
</script>

<style scoped>
	.boxShadowFilter{
		background: #F7F7F7;
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
		padding: 10px 0;
		margin: 10px 0;
	}
	input{
		background: #f7f7f7;
	}
	.activeSearch{
		background: rgba(0, 0, 0, 0.23);
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
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
	.noBorder{
		border-color: rgba(0, 0, 0, 0);
		z-index: 2;
		position: relative;
		background: white;
	}
	.listSearch div{
		background: white;
		padding: 10px 15px;
		margin: 0 15px;
		border-radius: 3px;
		display: grid;
		color: #757575;
		max-height: 160px;
		height: 100%;
		overflow-y: scroll;
	}
	.listSearch span{
		padding-bottom: 10px;
	}
	.listSearch{
		position: absolute;
		z-index: 2;
		width: 100%;
		top: 40px;
	}
	.priceFilterInputs{
		margin: 30px 15px 0 15px;
	}
	.priceFilterInputsContetn{
		display: flex;
		color: #757575;
	}
	.priceFilterInputsContetn div{
		display: flex;
		border-bottom: 1px solid #333333;
	}
	.priceFilterInputsContetn input{
		width: 45%;
	}
	.priceFilterInputsContetn div:nth-child(2){
		margin-left: 10%;
	}
	.blockFilterCity{
		border-bottom: 1px solid #333333;
		margin: 30px 15px 0 15px;
	}
	.blockFilter .btnRed{
		margin: 40px auto;
	}
	.blockFilter input{
		display: block;
		border: none;
		outline: none;
	}
	.blockFilter label{
		margin-bottom: 0;
	}
	.headerSidebar{
		display: flex;
		margin: 15px;
	}
	.headerSidebar img{
		outline: none;
	}
	.headerSidebar h4{
		margin-left: 40px;
	}
	.tabCat{
		overflow-x: scroll;
		width: 100%;
		display: flex;
		padding: 13px 0;
		font-size: 14px;
	}
	.tabCat span{
		background: #FFFFFF;
		color: #F64646;
		box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
		border-radius: 14px;
		padding: 3px 10px;
		height: 32px;
		margin: 0 5px;
		text-align: center;
		white-space: nowrap;
	}
	.header{
		padding: 5px;
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
</style>
