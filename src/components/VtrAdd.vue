<template lang="pug">
	div
		.header
			span Подать объявление
		b-form.mainBlock(@submit.stop.prevent="")
			b-form-group
				label(for="inpCat") Выбирите категорию*
				b-form-select#inpCat(placholder="Категория" :options="options" v-model="form.cat")
				label(for="inpSubCat") Выбирите подкатегорию*
				b-form-select#inpSubCat(placholder="Подкатегория" :options="options" v-model="form.subCat")
				label(for="nameInp") Название объявления
				b-form-input#nameInp(placeholder="Название" v-model="form.name")
				label(for="priceInp") Цена
				b-form-input#priceInp(placeholder="Цена" v-model="form.price")
				label(for="descInp") Описание
				b-form-textarea#descInp(placeholder="Описание" v-model="form.description")
				//картинки
				label(for="videoInp") Видео
				b-form-input#videoInp(placeholder="Ссылка" v-model="form.linkVideo")
				label(for="inpCity") Город
				b-form-select#inpCity(placholder="Выбрать город" :options="options" v-model="form.city")
			button.btnRed(type="submit") Добавить
</template>

<script>
	import {required} from "vuelidate/lib/validators";
	export default {
		data(){
			return{
				options: [
					{ value: 0, text: 'Выберите' },
				],
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
</style>
