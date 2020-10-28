<template lang="pug">
	div
		.header
			img.back(src="../assets/back.svg" @click="$router.go(-1)")
			span {{$route.name==='edit'?'Редактировать объявление':'Подать объявление'}}
		b-form.mainBlock(@submit.stop.prevent="$_vtr_add_addGood")
			b-form-group
				label(for="inpCat") Выбирите категорию*
				b-form-select#inpCat.borderInput( placholder="Категория" :options="options[0]" value-field="id" text-field="name" v-model="cats[0]" @change="$_vtr_add_load_selectCat(cats[0],1)")
				label(for="inpSubCat" v-if="options[1].length>1") Выбирите подкатегорию*
				b-form-select#inpSubCat.borderInput(placholder="Подкатегория" :options="options[1]" value-field="id" text-field="name" v-model="cats[1]" @change="$_vtr_add_load_selectCat(cats[1],2)" v-if="options[1].length>1")
				label(for="inpSubSubCat" v-if="options[1].length>1&&options[2].length>1") Выбирите подкатегорию*
				b-form-select#inpSubSubCat.borderInput(placholder="Подкатегория" :options="options[2]" value-field="id" text-field="name" v-model="cats[2]" v-if="options[1].length>1&&options[2].length>1")
				label(for="nameInp") Название объявления
				b-form-input#nameInp.borderInput(placeholder="Название" v-model="form.name")
				label(for="priceInp") Цена
				b-form-input#priceInp.borderInput(placeholder="Цена" v-model="$v.form.price.$model" v-money="money")
				label(for="descInp") Описание
				b-form-textarea#descInp.borderInput(placeholder="Описание" v-model="form.description")
				label(for="fileInp") Изображения
				b-form-file#fileInp.d-none(type="file" @input="$_vtr_add_loadimages()" v-model="file" multiple)
				.blockImages
					.image(v-for="(img,index) in form.img")
						img.close(src="../assets/close.svg" @click="$_vtr_add_delete_loadimages(img,index)")
						img(:src="$store.state.user.settings.server+'company/'+$store.state.user.data.id_company+'/up/goods/'+img")
					label(for="fileInp")
						.addImage
							img(src="../assets/addPhoto.svg" v-if="loadImgActive")
							b-spinner.customSpiner(variant="danger" v-else)
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
				options: {
					'0':[{id: null, name: 'Выберите'}],
					'1':[{id: null, name: 'Выберите'}],
					'2':[{id: null, name: 'Выберите'}]
				},
				cats:{'0':null,'1':null,'2':null},
				allCats:[],
				form:{
					name:'',
					price:'',
					description:'',
					img:[],
					video:'',
					id_cat:0,
					//geo:{lat:0,lng:0},
				},
				loadImgActive:true
			}
		},
		methods:{
			$_vtr_add_addGood:async function(){
				if(!this.$v.form.$invalid&&!this.$v.cats.$invalid){
					this.$_vtr_add_getLastCat();
					this.form.price=this.form.price.replace(/\s/g, '')*1;
					if(this.$route.name==='edit'){
						this.form.id=this.$route.params.idGood*1;
					}
					let data=await this.$store.getters.request('PUT',this.$store.state.user.settings.server+'goods',this.form)
					if(data&&!data.err){
						this.$store.commit('notification','Успешно обновлено')
						this.$router.replace({path: '/good/'+data.id,query: { pageName: 'Назад' }})
					}else{
						this.form.price=this.form.price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,'$1' + ' ')
					}
				}
			},
			$_vtr_add_getLastCat(){
				for(let i=Object.keys(this.cats).length-1;i>0;i--){
					if(this.cats[i]!==null){
						this.form.id_cat=this.cats[i];
						break
					}
				}
			},
			$_vtr_add_loadGood:async function(){
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'goods/'+this.$route.params.idGood)
				let catsSelect=[];
				const getParentCats=(id)=>{
					for(let cat of this.allCats){
						if(cat.id===id){
							catsSelect.push(cat.id)
							getParentCats(cat.id_parent)
							break
						}
					}
				}
				getParentCats(data.good.id_cat)
				for(let i=1;i<=catsSelect.length;i++){
					this.$_vtr_add_load_selectCat(catsSelect[catsSelect.length-i],i)
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
			$_vtr_add_load_selectCat(id,type){
				this.cats[type-1]=id;
				for(let i=type;i<Object.keys(this.options).length;i++){
					this.options[i]=[{ id: null, name: 'Выберите' }]
					this.cats[i]=null
				}
				this.options[type]=this.allCats.filter(item => item.id_parent===id);
				this.options[type].unshift({ id: null, name: 'Выберите' })
			},
			$_vtr_add_loadAllCat(){
				this.allCats=this.$store.state.user.cats;
				this.options[0]=this.allCats.filter(item => item.id_parent===0)
				this.options[0].unshift({ id: null, name: 'Выберите' })
				if(this.$route.name==='edit'){
					this.$_vtr_add_loadGood();
				}
			},
			$_vtr_add_delete_loadimages:async function(img,index){
				let photo=await this.$store.getters.request('DELETE',this.$store.state.user.settings.server+'goods/photo/'+img)
				if(photo&&!photo.err){
					this.form.img.splice(index,1)
				}
			},
			$_vtr_add_loadimages: async function(){
				this.loadImgActive=false;
				let data = new FormData();
				this.file.forEach((image,index)=>{
					if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(image.name)) {
					this.$store.commit('notification',"Файл  "+image.name+"  не поддерживается")
					this.file.splice(index,1)
					}else{
						data.append('file', image);
					}
				})
				let photo=await this.$store.getters.request('POST',this.$store.state.user.settings.server+'goods/photo/'+this.file.length,data)
				if(photo&&!photo.err){
					setTimeout(()=>{this.form.img=this.form.img.concat(photo.array_name)},1000)
				}
				setTimeout(()=>{this.loadImgActive=true},1000)
			}
		},
		created() {
			this.$_vtr_add_loadAllCat()
		},
		directives: {money: VMoney},
		validations:{
			cats:{
				'0': {
					required,
				},
				'1': {
					required:requiredIf(function() {return this.options[1].length>1})
				},
				'2':{
					required:requiredIf(function() {return this.options[2].length>1})
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
	.addImage img{
		width: 35px;
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
		width: auto;
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
