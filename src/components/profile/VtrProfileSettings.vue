<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Настройки профиля
		b-form.mainBlock(@submit.stop.prevent="vtr_profile_settings_save")
			b-form-group
				label(for="inpName") Название компании
				b-input#inpName(v-model="form.name" placeholder="Название компании")
			button.btnRed(type="submit") Сохранить
</template>

<script>
	import {required} from "vuelidate/lib/validators";
	export default {
		data(){
			return{
				form:{
					name:'',
				}
			}
		},
		methods:{
			vtr_profile_settings_save(){
				console.log(this.form)
			}
		},
		created() {
			this.form.name=this.$store.state.user.company.name
		},
		validations:{
			form:{
				name: {
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
		margin: 13px 30px 0 30px;
	}
	input{
		border:1px solid #333333;
	}
</style>
