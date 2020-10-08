<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span {{$route.name==='addManager'?'Добавить менеджера':'Редактировать менеджера'}}
		b-form.mainBlock(@submit.stop.prevent="vtr_edit_managerAdd")
			b-form-group
				label(for="inpName") Имя менеджера
				b-input#inpName(v-model="formManager.name" placeholder="Имя менеджера")
				label(for="inpSurName") Фамилия менеджера
				b-input#inpSurName(v-model="formManager.surName" placeholder="Фамилия менеджера")
				label(for="inpNumber") Номер телефона
				b-input#inpNumber(v-model="formManager.phone" v-mask="'+7(###) ###-##-##'" type="tel")
			button.btnRed(type="submit") {{$route.name==='addManager'?'Добавить':'Редактировать'}}

</template>

<script>
	import {required} from "vuelidate/lib/validators";
	export default {
		data(){
			return{
				formManager:{
					name:'',
					surName:'',
					phone:'',
				}
			}
		},
		methods:{
			vtr_edit_managerAdd(){
				console.log(this.formManager)
			}
		},
		validations:{
			formManager:{
				name: {
					required,
				},
				surName: {
					required,
				},
				phone: {
					required,
				},
			}
		},
	}
</script>

<style scoped>
	.btnRed{
		margin: 30px auto auto 0;
		width: 100%;
	}
	.mainBlock {
		margin: 13px 15px 0 15px;
	}
	input{
		border:1px solid #333333;
	}
</style>
