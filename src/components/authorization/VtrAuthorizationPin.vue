<template lang="pug">
	.mainPinBlock
		h5 {{havePin?'Придумайте пин для входа в приложение':'Укажите пин для входа в приложение'}}
			.formPin
				label(for="pinInput")
					.blockPin(v-for="i in 4" :class="i<=pin.length?'blockPinActive':'blockPinDeActive'" :key="i")
				input#pinInput(v-model="pin" maxlength="4" ref="pinInput")
				span.forgotPin(@click="$refs.forgotPinModal.show()") Забыл пин?
				button.btnRed(@click="$_vtr_auth_pin_login" :disabled="pin.length!==4") {{havePin?'Создать':'Войти'}}
		b-modal(hide-footer ref="forgotPinModal" centered no-close-on-backdrop)
			template(slot="modal-header")
				h4 балабалаблаба?
				button.close( @click="$refs.forgotPinModal.hide()")
					span(aria-hidden="true") x
			.container
				p балаабалбалабблала бала бабулбабудап бап!
				button.btnRed(@click="$store.commit('clearAll')") да?
</template>

<script>
	export default {
		data(){
			return{
				pin:'',
				havePin:false,
			}
		},
		mounted() {
			this.havePin=localStorage.getItem('pin')===null;
			this.$refs.pinInput.focus();
		},
		methods:{
			$_vtr_auth_pin_login(){
				if(this.havePin){
					localStorage.setItem('pin',this.pin)
					this.$router.push('/feed')
				}else{
					if(localStorage.getItem('pin')===this.pin){
						this.$router.push('/feed')
					}else{
						this.pin='';
						this.$store.commit('notification','Не правильный пин-код')
					}
				}
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
