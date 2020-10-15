<template lang="pug">
	div
		.header
			span Подать объявление
		b-form.mainBlock(@submit.stop.prevent="")
			b-form-group
				label(for="inpCat") Выбирите категорию*
				b-form-select#inpCat.borderInput(placholder="Категория" :options="options" v-model="form.cat")
				label(for="inpSubCat") Выбирите подкатегорию*
				b-form-select#inpSubCat.borderInput(placholder="Подкатегория" :options="options" v-model="form.subCat")
				label(for="nameInp") Название объявления
				b-form-input#nameInp.borderInput(placeholder="Название" v-model="form.name")
				label(for="priceInp") Цена
				b-form-input#priceInp.borderInput(placeholder="Цена" v-model="form.price")
				label(for="descInp") Описание
				b-form-textarea#descInp.borderInput(placeholder="Описание" v-model="form.description")
				label(for="fileInp") Изображения
				b-form-file#fileInp.d-none(type="file" @input="vtr_add_loadimages(file)" v-model="file" multiple)
				.blockImages
					.image(v-for="item in 5")
						img.close(src="../assets/close.svg" @click="vtr_delete_loadimages(item)")
						img(src="https://farm2.staticflickr.com/1941/45523337912_db9847a02e_z.jpg")
					label(for="fileInp")
						.addImage
							img(src="../assets/addPhoto.svg")
				label(for="videoInp") Видео
				b-form-input#videoInp.borderInput(placeholder="Ссылка" v-model="form.linkVideo")
				label(for="inpCity") Город
				b-form-select#inpCity.borderInput(placholder="Выбрать город" :options="options" v-model="form.city")
			button.btnRed(type="submit") Добавить
</template>

<script>
	import {required,maxLength} from "vuelidate/lib/validators";
	export default {
		data(){
			return{
				options: [
					{ value: 0, text: 'Выберите' },
				],
				file:[],
				form:{
					cat:0,
					subCat:0,
					name:'',
					price:'',
					description:'',
					img:[],
					linkVideo:'',
					city:0,
				}
			}
		},
		methods:{
			vtr_delete_loadimages(index){
				console.log(index)
			},
			vtr_add_loadimages(file){
				file.forEach(image=>{
					if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(image.name)) {
						alert('Файл  '+image.name+'  не поддерживается')
					}else{
						let data = new FormData();
						data.append('file', image);
						console.log(data)//отправка фоток
					}
				})
			}
		},
		validations:{
			form:{
				cat: {
					required,
				},
				subCat: {
					required,
				},
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
				linkVideo: {
					required,
				},
				city: {
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
