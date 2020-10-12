<template lang="pug">
	.mainLoginBlock
		.blockCenter
			h3 Авторизация
			b-form.formLogin(@submit.stop.prevent="$store.commit('firstAuth',formLogin)")
				b-form-group
					b-form-input(
						required
						type="tel"
						v-mask="'+7(###) ###-##-##'"
						v-model="$v.formLogin.phone.$model"
						:state="$v.formLogin.phone.$dirty?!$v.formLogin.phone.$error:null"
						placeholder="+7 (___) __-__-___")
					b-form-input(
						required
						v-model="$v.formLogin.password.$model"
						:state="$v.formLogin.password.$dirty?!$v.formLogin.password.$error:null"
						type="password"
						placeholder="Пароль")
				button.btnRed(type="submit" :disabled="$v.formLogin.$invalid") Далее

</template>

<script>
	import {minLength, required} from "vuelidate/lib/validators";
	export default {
		data(){
			return{
				formLogin:{
					phone: '',
					password: '',
				},
			}
		},
		validations:{
			formLogin:{
				phone: {
					required,
					minLength: minLength(17),
				},
				password:{
					required,
					minLength:minLength(6)
				}
			}
		},
		watch:{
			'$store.state.user.data'(){
				if(this.$store.state.user.data!=='-1'){
					this.$router.push('/pin')
				}
			},
		},
	}
</script>
<style scoped>
	.mainLoginBlock{
		background: black;
		width: 100%;
		height: 100%;
		position: absolute;
		color: white;
		text-align: center;
		min-width: 100%;
	}
	.blockCenter{
		top: 50%;
		transform: translateY(-50%);
		position: relative;
	}
	.formLogin{
		width: 50%;
		margin: 0 auto;
		display: block;
		min-width: 290px;
		max-width: 400px;
	}
	.formLogin input{
		margin-top: 25px;
	}
	.formLogin input::-webkit-outer-spin-button,
	.formLogin input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.formLogin input[type=number] {
		-moz-appearance: textfield;
	}
	.formLogin .btnRed{
		margin: 50px auto;
		max-width: 200px;
	}
</style>
