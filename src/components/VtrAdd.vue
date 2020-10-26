<template lang="pug">
	div
		.header
			img.back(src="../assets/back.svg" @click="$router.go(-1)")
			span {{$route.name==='edit'?'Редактировать объявление':'Подать объявление'}}
		b-form.mainBlock(@submit.stop.prevent="$_vtr_add_addGood")
			b-form-group
				label(for="inpCat") Выбирите категорию*
				b-form-select#inpCat.borderInput(placholder="Категория" :options="optionsCats" value-field="id" text-field="name" v-model="arrCats.cat" @change="$_vtr_add_load_selectCat(arrCats.cat,1)")
				label(for="inpSubCat" v-if="optionsSubCats.length>1") Выбирите подкатегорию*
				b-form-select#inpSubCat.borderInput(placholder="Подкатегория" :options="optionsSubCats" value-field="id" text-field="name" v-model="arrCats.subCat" @change="$_vtr_add_load_selectCat(arrCats.subCat,2)" v-if="optionsSubCats.length>1")
				label(for="inpSubSubCat" v-if="optionsSubCats.length>1&&optionsSubSubCats.length>1") Выбирите подкатегорию*
				b-form-select#inpSubSubCat.borderInput(placholder="Подкатегория" :options="optionsSubSubCats" value-field="id" text-field="name" v-model="arrCats.subSubCat" v-if="optionsSubCats.length>1&&optionsSubSubCats.length>1")
				label(for="nameInp") Название объявления
				b-form-input#nameInp.borderInput(placeholder="Название" v-model="form.name")
				label(for="priceInp") Цена
				b-form-input#priceInp.borderInput(placeholder="Цена" v-model="$v.form.price.$model" v-money="money")
				label(for="descInp") Описание
				b-form-textarea#descInp.borderInput(placeholder="Описание" v-model="form.description")
				label(for="fileInp") Изображения
				b-form-file#fileInp.d-none(type="file" @input="$_vtr_add_loadimages(file)" v-model="file" multiple)
				.blockImages
					.image(v-for="item in 5")
						img.close(src="../assets/close.svg" @click="$_vtr_add_delete_loadimages(item)")
						img(src="https://farm2.staticflickr.com/1941/45523337912_db9847a02e_z.jpg")
					label(for="fileInp")
						.addImage
							img(src="../assets/addPhoto.svg")
				label(for="videoInp") Видео
				b-form-input#videoInp.borderInput(placeholder="Ссылка" v-model="form.video")
			button.btnRed(type="submit") {{$route.name==='edit'?'Редактировать':'Добавить'}}
			button.btnRed.noMarginTop(type="button" @click="$router.go(-1)" v-if="$route.name==='edit'") Отмена
</template>

<script>
	import {required,maxLength,requiredIf} from "vuelidate/lib/validators";
	import {VMoney} from 'v-money';
	export default {
		data(){
			return{
				money: {
					thousands: ' ',
					precision: 0,
				},
				file:[],

				optionsCats: [{ id: null, name: 'Выберите' }],
				optionsSubCats: [{ id: null, name: 'Выберите' }],
				optionsSubSubCats: [{ id: null, name: 'Выберите' }],
				allCats:[],
				arrCats:{
					cat:null,
					subCat:null,
					subSubCat:null,
				},
				form:{
					name:'',
					price:'',
					description:'',
					img:[''],
					video:'',
					id_cat:0,
					//geo:{lat:0,lng:0},
				}
			}
		},
		methods:{
			$_vtr_add_addGood:async function(){
				if(!this.$v.form.$invalid&&!this.$v.arrCats.$invalid){
					this.$_vtr_add_getLastCat();
					this.form.price=this.form.price.replace(/\s/g, '')*1;
					if(this.$route.name==='edit'){
						this.form.id=this.$route.params.idGood*1;
					}
					let data=await this.$store.getters.request('PUT',this.$store.state.user.settings.server+'goods',this.form)
					if(data&&!data.err){
						this.$store.commit('notification',data.text)
						this.$router.replace({path: '/profile/good/'+data.id,query: { pageName: 'Назад' }})
					}else{
						this.form.price=this.form.price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,'$1' + ' ')
					}
				}
			},
			$_vtr_add_getLastCat(){
				if(this.arrCats.cat!==null&&this.arrCats.subCat!==null&&this.arrCats.subSubCat!==null){
					this.form.id_cat=this.arrCats.subSubCat;
					return true;
				}
				if(this.arrCats.cat!==null&&this.arrCats.subCat!==null){
					this.form.id_cat=this.arrCats.subCat;
					return true;
				}
				if(this.arrCats.cat!==null){
					this.form.id_cat=this.arrCats.cat;
					return true;
				}
			},
			$_vtr_add_delete_loadimages(index){
				console.log(index)
			},
			$_vtr_add_loadimages(file){
				file.forEach(image=>{
					if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(image.name)) {
						this.$store.commit('notification',"Файл  "+image.name+"  не поддерживается")
					}else{
						let data = new FormData();
						data.append('file', image);
						console.log(data)//отправка фоток
					}
				})
			},
			$_vtr_add_loadGood:async function(){
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/'+this.$route.params.idGood)
				let catsSelect=[data.good.id_cat];
				catsSelect.push(this.allCats.filter(item=>item.id===catsSelect[0])[0].id_parent)
				catsSelect.push(this.allCats.filter(item=>item.id===catsSelect[1])[0].id_parent)
				if(catsSelect[2]!==0){
					this.$_vtr_add_load_selectCat(catsSelect[2],1)
					this.$_vtr_add_load_selectCat(catsSelect[1],2)
					this.arrCats.subSubCat=catsSelect[0];
					this.arrCats.subCat=catsSelect[1];
					this.arrCats.cat=catsSelect[2];
				}else{
					this.$_vtr_add_load_selectCat(catsSelect[1],1)
					this.$_vtr_add_load_selectCat(catsSelect[0],2)
					this.arrCats.subCat=catsSelect[0];
					this.arrCats.cat=catsSelect[1];
				}
				if(data&&!data.err){
					this.form.name=data.good.name;
					this.form.description=data.good.description;
					this.form.img=data.good.img;
					this.form.video=data.good.video;
				}
				let dataPrice=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/'+this.$route.params.idGood+'/price')
				if(dataPrice&&!dataPrice.err){
					this.form.price=dataPrice.price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,'$1' + ' ');
				}
			},
			$_vtr_add_load_selectCat:async function(id,type){
				if(id===null){
					if(type===1){
						this.optionsSubCats=[{ id: null, name: 'Выберите' }];
						this.optionsSubSubCats=[{ id: null, name: 'Выберите' }];
						this.arrCats.subCat=null;
						this.arrCats.subSubCat=null;
					}else{
						this.optionsSubSubCats=[{ id: null, name: 'Выберите' }];
						this.arrCats.subSubCat=null;
					}
					return
				}
				switch (type) {
					case 1:{
						this.optionsSubCats=[{ id: null, name: 'Выберите' }];
						this.optionsSubSubCats=[{ id: null, name: 'Выберите' }];
						this.arrCats.subCat=null;
						this.subSubCat=null;
						this.optionsSubCats=this.allCats.filter(item => item.id_parent===id)
						this.optionsSubCats.unshift({ id: null, name: 'Выберите' })
						break
					}
					case 2:{
						this.optionsSubSubCats=[{ id: null, name: 'Выберите' }];
						this.arrCats.subSubCat=null;
						this.optionsSubSubCats=this.allCats.filter(item => item.id_parent===id);
						this.optionsSubSubCats.unshift({ id: null, name: 'Выберите' })
						break
					}
				}
			},
			$_vtr_add_loadAllCat: async function(){
				this.allCats=this.$store.state.user.cats;
				this.optionsCats=this.allCats.filter(item => item.id_parent===0)
				this.optionsCats.unshift({ id: null, name: 'Выберите' })

				if(this.$route.name==='edit'){
					this.$_vtr_add_loadGood();
				}
			}
		},
		created() {
			this.$_vtr_add_loadAllCat()
		},
		directives: {money: VMoney},
		validations:{
			arrCats:{
				cat: {
					required,
				},
				subCat: {
					required:requiredIf(function() {return this.optionsSubCats.length>1})
				},
				subSubCat:{
					required:requiredIf(function() {return this.optionsSubSubCats.length>1})
				},
			},
			form:{
				name: {
					required,
					maxLength:maxLength(100)
				},
				price: {
					required,
				},
				description: {
					required,
				},
			}
		},
	}
</script>

<style scoped>
	.btnRed{
		margin: 30px auto 15px 0;
		width: 100%;
	}
	.noMarginTop{
		margin-top: 0;
	}
	.mainBlock {
		margin: 13px 15px 0 15px;
		font-size: 14px !important;
	}
	label{
		margin-bottom: 0;
		display: block;
	}
	textarea{
		height: 150px;
		resize: none;
	}
	.blockImages{
		display: inline-flex;
		flex-wrap: wrap;
	}
	.addImage{
		display: grid;
		place-items: center;
		height: 80px;
		width: 110px;
		background: #C4C4C4;
		border-radius: 3px;
		margin: 2px;
	}
	.image{
		display: grid;
		place-items: center;
		height: 80px;
		width: 110px;
		background: #C4C4C4;
		border-radius: 3px;
		margin: 2px;
		position: relative;
	}
	.image img{
		height: 100%;
		width: 100%;
		border-radius: 3px;
	}
	.image .close{
		height: 20px;
		width: 20px;
		position: absolute;
		right: 0;
		top: 0;
		background: rgba(255, 255, 255, 0.9);
		padding: 2px;
		border-radius: 3px;
	}
</style>
