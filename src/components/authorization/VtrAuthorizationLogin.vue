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
					b-input-group
						b-form-input(
							required
							v-model="$v.formLogin.password.$model"
							:type="lookPass?'text':'password'"
							placeholder="Пароль")
						b-input-group-append
							button.watchPassword(type="button")
								img(:src="lookPass?imgPass.text:imgPass.pass" @click="lookPass=!lookPass")
				button.btnRed(type="submit" :disabled="$v.formLogin.$invalid") Далее
			.spinerBlock(v-else)
				b-spinner.customSpiner(variant="danger")
</template>

<script>
	import pass from '../../assets/lookPass.svg'
	import text from '../../assets/lookPassActive.svg'
	import {minLength, required} from "vuelidate/lib/validators";
	export default {
		data(){
			return{
				formLogin:{
					phone: '',
					password: '',
				},
				load:false,
				lookPass:false,
				imgPass:{
					pass:pass,
					text:text
				}
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
		beforeRouteLeave(to, from, next){
			if(!this.$store.state.user.errAuth){
				next();
			}else{
				this.$router.go(1)
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
	.watchPassword img{
		width: 25px;
		transition: .3s ease;
	}
	button.watchPassword{
		outline: none;
	}
	.watchPassword{
		display: block;
		width: 100%;
		height: calc(1.5em + 0.75rem + 2px);
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.5;
		color: #495057;
		background-color: #fff;
		margin-top: auto;
		border: 1px solid white;
		border-radius: 0 0.25rem 0.25rem 0;
	}
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
		outline: none;
		box-shadow: none;
		border-color: #ced4da;
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
