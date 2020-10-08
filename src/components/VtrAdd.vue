<template lang="pug">
	div
		.header
			span Подать объявление
		b-form.mainBlock(@submit.stop.prevent="")
			b-form-group
				label(for="inpCat") Выбирите категорию*
				b-form-select#inpCat(placholder="Категория")
				label(for="inpSubCat") Выбирите подкатегорию*
				b-form-select#inpSubCat(placholder="Подкатегория")
				label(for="nameInp") Название объявления
				b-form-input#nameInp(placeholder="Название")
				label(for="priceInp") Цена
				b-form-input#priceInp(placeholder="Цена")
				label(for="descInp") Описание
				b-form-textarea#descInp(placeholder="Описание")
				//картинки
				label(for="videoInp") Видео
				b-form-input#videoInp(placeholder="Ссылка")
				label(for="inpCity") Город
				b-form-select#inpCity(placholder="Выбрать город")
			button.btnRed(type="submit") Добавить
</template>

<script>
	export default {
		data(){
			return{
				form:{
					cat:'',
					subCat:'',
					name:'',
					price:'',
					description:'',
					img:[],
					linkVideo:'',
					city:'',
				}
			}
		}
	}
</script>

<style scoped>
	.btnRed{
		margin: 30px auto auto 0;
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
