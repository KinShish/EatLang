<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Имя пользователя
			//span.dottedActive(:class="false?'':'deActive'")
		transition(name="opacity")
			.modalPhoto(v-if="photoModal" @click="photoModal=false")
				img(:src="imgSrc")
		.whiteBlock(:class="false?'paddingPhoto':''" ref="chatFeed")
			//span.mainData 20 августа 2020
			div(v-for="message in roomMessages" :class="message.id_user===$store.state.user.data.id?'blockMessageMe':'blockMessage'" :key="message.datetime")
				span.timeMessage(v-if="message.id_user===$store.state.user.data.id") {{$_vtr_dialogs_showTime(message.datetime)}}
				.logo(v-if="message.id_user!==$store.state.user.data.id")
					img(src="https://st.depositphotos.com/1719616/1212/i/450/depositphotos_12120315-stock-photo-new-tractor-on-white-background.jpg")
				span.text {{message.text}}
				span.timeMessage(v-if="message.id_user!==$store.state.user.data.id") {{$_vtr_dialogs_showTime(message.datetime)}}
			//.blockMessageMe
				span.timeMessage 15:35
				.photoBlock(@click="$_vtr_dialog_watchPhoto('https://st.depositphotos.com/1719616/1212/i/450/depositphotos_12120315-stock-photo-new-tractor-on-white-background.jpg')")
					img(src="https://st.depositphotos.com/1719616/1212/i/450/depositphotos_12120315-stock-photo-new-tractor-on-white-background.jpg")
		//.blockAddImg
			.imgBlock(v-for="item in 10")
				img.close(src="../../assets/close.svg" @click="$_vtr_dialog_deletePhoto(item)")
				img(src="https://www.imgacademy.com/themes/custom/imgacademy/images/helpbox-contact.jpg")
		.blockSendMessage
			b-form-file#loadPhoto.d-none(type="file" @input="$_vtr_dialog_addPhoto" v-model="filePhoto")
			label(for="loadPhoto")
				img(src="../../assets/chat/chatImage.svg")
			input(v-model="textMessage")
			img(src="../../assets/chat/chatSend.svg" @click="$_vtr_dialog_sendMessage")
		span(ref="blockChat")
</template>

<script>
	import {required} from "vuelidate/lib/validators";
	export default {
		data(){
			return{
				textMessage:'',
				filePhoto:[],
				imgSrc:'',
				photoModal:false,
				room:[],
				roomMessages:[]
			}
		},
		methods:{
			$_vtr_dialog_sendMessage(){
				if(!this.$v.textMessage.$invalid){
					const makeid=()=>{
						let text = "";
						const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

						for (let i = 0; i < 50; i++)
							text += possible.charAt(Math.floor(Math.random() * possible.length));

						return text;
					}
					let hash=makeid();
					this.textMessage=this.textMessage.replace(/^\s*/,'').replace(/\s*$/,'')
					const date=new Date().getTime();
					this.roomMessages.push({text: this.textMessage, id_user: this.$store.state.user.data.id, datetime:date,hash})
					this.textMessage='';
					this.$_vtr_dialogs_scrollBottom();
					console.log(this.room[0].id_company)
					this.$store.getters.submitChat( {
						hash,
						text:this.textMessage,
						id:this.$store.state.user.data.id,
						id_recipient:this.room[0].id_company,
						datetime:'',
						key:this.$route.params.key
					},res=>{
						console.log(res)
					});
				}
			},
			$_vtr_dialogs_showTime(dateTime){
				const d = new Date(dateTime);
				return d.getHours().toString().padStart(2, '0')+':'+d.getMinutes().toString().padStart(2, '0');
			},
			$_vtr_dialogs_scrollBottom(){
				this.$nextTick(()=>{
					this.$refs.blockChat.scrollIntoView()
				})
			},
			$_vtr_dialog_addPhoto(){
				console.log(this.filePhoto)
			},
			$_vtr_dialog_deletePhoto(index){
				console.log(index)
			},
			$_vtr_dialog_watchPhoto(img){
				this.imgSrc=img;
				this.photoModal=true;
			},
		},
		beforeRouteLeave(to, from, next){
			this.photoModal=false;
			next();
		},
		mounted() {
			this.room=this.$store.state.user.rooms.filter(room=>room.key===this.$route.params.key)
			this.roomMessages=this.$store.state.user.messages.filter(message=>message.key===this.$route.params.key)
			this.$_vtr_dialogs_scrollBottom()
			if(this.$route.query.type==='manager'){
				this.$store.commit('loginChat',false)
			}
		},
		watch:{
			'$store.state.user.messages'(){
				this.roomMessages=this.roomMessages.concat(this.$store.state.user.messages.filter(message=>message.key===this.$route.params.key));
				this.$_vtr_dialogs_scrollBottom();
			},
			'photoModal'(){
				if(this.photoModal){
					document.body.style.cssText="overflow:hidden";
					this.$refs.chatFeed.style.cssText="overflow:hidden";
				}else{
					document.body.style.cssText="overflow:auto";
					this.$refs.chatFeed.style.cssText="overflow:auto";
				}
			},
		},
		validations:{
			textMessage:{
				required
			}
		},
	}
</script>

<style scoped>
	.logo{
		overflow: hidden;
		display: grid;
		place-content: center;
		width: 25px;
		height: 25px;
		background: #e6e6e6;
		border-radius: 50%;
		margin-top: 10px;
		margin-right: 10px;
	}
	.logo img{
		width: 100%;
		height: auto;
	}
	.modalPhoto{
		background: rgba(0, 0, 0, 0.23);
		box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		padding: 0 7px;
		display: grid;
	}
	.modalPhoto img{
		width: 100%;
		height: auto;
		max-width: 600px;
		margin: 0 auto;
		display: block;
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}
	.paddingPhoto{
		margin-bottom: 150px !important;
	}
	.blockAddImg{
		overflow-x: scroll;
		width: 100%;
		display: flex;
		padding: 13px 0;
		font-size: 14px;
		overflow-y: hidden;
		background: white;
		position: fixed;
		bottom: 50px;
		max-width: 600px;
	}
	.blockAddImg .imgBlock{
		height: 80px;
		width: 110px;
		background: #e6e6e6;
		position: relative;
		display: grid;
		place-content: center;
		border-radius: 3px;
		flex: none;
		margin: 0 5px;
	}
	.imgBlock img{
		width: 100%;
		height: auto;
	}
	.imgBlock .close{
		height: 20px;
		width: 20px;
		position: absolute;
		right: 0;
		top: 0;
		background: rgba(255, 255, 255, 0.9);
		padding: 2px;
		border-radius: 3px;
	}
	.mainData{
		color: #757575;
		font-size: 12px;
		width: 100%;
		display: block;
		text-align: center;
		margin: 5px 0;
	}
	.timeMessage{
		font-size: 12px;
		color: #757575;
	}
	.photoBlock{
		background: #e6e6e6;
		display: grid;
		width: 72%;
		place-content: center;
	}
	.photoBlock img{
		width: 100%;
		height: auto;
	}
	.blockMessage{
		display: flex;
	}
	.blockMessage .text{
		background: #E6E6E6;
		box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
		border-radius: 3px;
		padding: 10px;
		width: 72%;
		float: left;
		margin: 10px 0;
	}
	.blockMessage .timeMessage{
		margin-top: auto;
		margin-left: 5px;
		margin-bottom: 5px;
	}
	.blockMessageMe{
		display: flex;
	}
	.blockMessageMe .timeMessage{
		width: 28%;
		text-align: right;
		margin-right: 5px;
		margin-top: auto;
		margin-bottom: 10px;
	}
	.blockMessageMe .text{
		background: rgba(246, 70, 70, 0.76);
		box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
		border-radius: 3px;
		padding: 10px;
		width: 72%;
		float: right;
		margin: 10px 0;
		color: white;
	}
	.header{
		position: fixed;
		width: 100%;
		top: 0;
	}
	.whiteBlock{
		margin-top: 50px;
		padding: 0 15px;
		overflow-x: hidden;
		overflow-y: scroll;
		margin-bottom: 60px;
	}
	.dottedActive{
		width: 10px;
		height: 10px;
		background: #26C281;
		border-radius: 50%;
		display: inline-block;
		margin-left: 5px;

		transition: .3s ease;
	}
	.deActive{
		background: #f54646 !important;
	}
	.blockSendMessage label img{
		margin-bottom: -1rem;
	}
	.blockSendMessage{
		position: fixed;
		bottom: 0;
		width: 100%;
		background: white;
		height: 50px;
		display: flex;
		box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.1);
		padding: 4px 8px;
	}
	.blockSendMessage input{
		flex: auto;
		height: 30px;
		margin-top: 6px;
		border: none;
		padding-left: 10px;
		color: #757575;
	}
	.blockSendMessage input:focus{
		outline: none;
	}
</style>
