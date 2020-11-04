<template lang="pug">
	.mainLoginBlock
		h3 Авторизация
			b-form.formLogin(@submit.stop.prevent="$_vtr_login_submit" v-if="!load")
				b-form-group
					b-form-input(
						required
						type="tel"
						v-mask="'+7(###) ###-##-##'"
						v-model="$v.formLogin.phone.$model"
						placeholder="+7 (___) __-__-___"
						@input="$_vtr_login_phone")
					b-form-input(
						required
						v-model="$v.formLogin.password.$model"
						type="password"
						placeholder="Пароль")
				button.btnRed(type="submit" :disabled="$v.formLogin.$invalid") Далее
			.spinerBlock(v-else)
				b-spinner.customSpiner(variant="danger")
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
				load:false
			}
		},
		methods:{
			$_vtr_login_phone(){
				if(this.formLogin.phone==='+7(8'){
					this.formLogin.phone='+7'
				}
			},
			$_vtr_login_submit(){
				if(!this.$v.formLogin.$invalid){
					this.$store.commit('firstAuth',this.formLogin)
					this.load=true;
				}
			}
		},
		deactivated() {
			this.formLogin={phone: '', password: '',};
			this.load=false;
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
			'$store.state.user.errAuth'(){
				if(this.$store.state.user.errAuth){
					this.formLogin.password='';
					this.load=false;
				}
			}
		}

	}
</script>
<style scoped>
	.spinerBlock{
		height: 260px;
	}
	.mainLoginBlock{
		background: black;
		width: 100%;
		height: 100%;
		position: absolute;
		color: white;
		text-align: center;
		min-width: 100%;
		display: grid;
		place-items: center;
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
