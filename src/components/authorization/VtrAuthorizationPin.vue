<template lang="pug">
	.mainPinBlock
		.paddingPin
			h5 {{havePin?'Придумайте уникальный пин для входа в приложение':'Укажите пин'}}
			.formPin
				label(for="pinInput")
					.blockPin(v-for="i in 4" :class="i<=pin.length?'blockPinActive':'blockPinDeActive'" :key="i")
				input#pinInput(v-model="pin" maxlength="4" ref="pinInput" type="number")
				span.forgotPin(@click="$refs.forgotPinModal.show()" v-if="!havePin") Забыли пин?
				button.btnRed(@click="$_vtr_auth_pin_login" :disabled="pin.length!==4") {{havePin?'Создать':'Войти'}}
		b-modal(hide-footer ref="forgotPinModal" centered no-close-on-backdrop)
			template(slot="modal-header")
				h4 Будет произведен выход из аккаунта.
				button.close( @click="$refs.forgotPinModal.hide()")
					span(aria-hidden="true") x
			.container
				p Для повторного входа обратитесь к администратору вашей компании.
				button.btnRed(@click="$refs.forgotPinModal.hide(),$store.commit('clearAll')") Выйти
</template>

<script>
	export default {
		data(){
			return{
				pin:'',
				havePin:false,
			}
		},
		activated() {
			this.havePin=localStorage.getItem('pin')===null;
			this.$refs.pinInput.focus();
		},
		beforeRouteLeave(to, from, next){
			if(to.name!=='login'){
				next();
			}else{
				this.$router.go(1)
			}
		},
		methods:{
			$_vtr_auth_pin_login(){
				if(this.havePin){
					localStorage.setItem('pin',this.pin)
					this.$router.push('/feed')
					this.havePin=true;
				}else{
					if(localStorage.getItem('pin')===this.pin){
						this.$router.push('/feed');
					}else{
						this.$store.commit('notification','Не правильный пин-код');
					}
				}
				this.pin='';
			}
		},
		watch:{
			'pin'(){
				if(this.pin.length===4){
					this.$_vtr_auth_pin_login();
				}
			}
		}
	}
</script>

<style scoped>
	.paddingPin{
		padding: 0 10px;
	}
	.mainPinBlock{
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
	.blockPin{
		width: 25px;
		height: 25px;
		display: inline-block;
		margin: 0 5px;
		border-radius: 50%;
		transition: background-color .2s ease;
	}
	.blockPinActive{
		background-color: #757575;
	}
	.blockPinDeActive{
		background-color: white;
	}
	.formPin{
		width: 50%;
		margin: 15px auto;
		display: block;
		min-width: 290px;
		max-width: 400px;
	}
	.forgotPin{
		text-decoration: underline;
		display: block;
	}
	.formPin .btnRed{
		margin: 50px auto;
		max-width: 200px;
	}
	#pinInput{
		opacity: 0;
		height: 0;
		width: 0;
		position: absolute;
		outline: none;
		box-shadow: none;
		caret-color: black;
		overflow: hidden;
	}
</style>
