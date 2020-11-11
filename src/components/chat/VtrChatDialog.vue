<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span(v-if="room[0]") {{room[0].name}}
			//span.dottedActive(:class="false?'':'deActive'")
		transition(name="opacity")
			.modalPhoto(v-if="photoModal" @click="photoModal=false")
				img(:src="imgSrc")
		.whiteBlock(:class="photo.length>0?'paddingPhoto':''" ref="chatFeed" v-if="roomMessages.length>0")
			transition-group(name="opacity")
				div(v-for="(message,index) in roomMessages" :key="message.hash")
					span.mainData(v-if="$_vtr_dialogs_showDate(index,message.dateTime)") {{$_vtr_dialogs_showDate(index,message.dateTime)}}
					div(v-if="message.text.split('@')[0].split(':').slice(1)[0]!==''" :class="message.id===$store.state.user.data.id?'photoBlockMe':'photoBlock'")
						img(v-for="image in message.text.split('@')[0].split(':').slice(1)"
							:src="$store.state.user.settings.server+'company/'+message.id+'/up/chat/'+image"
							@click="$_vtr_dialog_watchPhoto($store.state.user.settings.server+'company/'+message.id+'/up/chat/'+image)")
					div(:class="message.id===$store.state.user.data.id?'blockMessageMe':'blockMessage'")
						span.timeMessage(v-if="message.id===$store.state.user.data.id") {{$_vtr_dialogs_showTime(message.dateTime)}}
						.logo(v-if="message.id!==$store.state.user.data.id")
							img(:src="$store.state.user.settings.server+'company/'+room[0].id_company+'/up/goods/'+room[0].img" v-if="room[0].img")
							img.noImg(src="../../assets/loadLogo.svg" v-else)
						span.text(v-if="message.text.split('@')[1]") {{message.text.split('@')[1]}}
						span.timeMessage(v-if="message.id!==$store.state.user.data.id") {{$_vtr_dialogs_showTime(message.dateTime)}}
		.blockAddImg(v-if="photo.length>0")
			.imgBlock(v-for="(img,index) in photo")
				img.close(src="../../assets/close.svg" @click="$_vtr_dialog_deletePhoto(index,img)")
				img(:src="$store.state.user.settings.server+'company/'+$store.state.user.data.id_company+'/up/chat/'+img")
		.blockSendMessage
			b-form-file#loadPhoto.d-none(type="file" @input="$_vtr_dialog_addPhoto" v-model="filePhoto" multiple)
			label(for="loadPhoto" v-if="loadImgActive")
				img(src="../../assets/chat/chatImage.svg")
			b-spinner.customSpiner(variant="danger" v-else)
			b-form(@submit.stop.prevent="$_vtr_dialog_sendMessage")
				input(v-model="textMessage")
			img(src="../../assets/chat/chatSend.svg" @click="$_vtr_dialog_sendMessage")
		span(ref="blockChat")
</template>

<script>
	export default {
		data(){
			return{
				textMessage:'',
				filePhoto:[],
				photo:[],
				imgSrc:'',
				photoModal:false,
				room:[],
				roomMessages:[],
				loadImgActive:true
			}
		},
		methods:{
			async $_vtr_dialog_sendMessage(){
				this.textMessage=this.textMessage.replace(/^\s*/,'').replace(/\s*$/,'')
				if(this.textMessage||this.photo.length>0){
					this.textMessage='img:'+this.photo.join(':')+'@'+this.textMessage;
					const date=new Date().getTime();
					const makeid=()=>{
						let text = "";
						const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

						for (let i = 0; i < 37; i++)
							text += possible.charAt(Math.floor(Math.random() * possible.length));

						return date+text;
					}
					let hash=makeid();
					this.textMessage=this.textMessage.replace(/^\s*/,'').replace(/\s*$/,'')
					await this.$store.getters.submitChat( {
						hash,
						text:this.textMessage,
						id:this.$store.state.user.data.id,
						id_recipient:this.room[0].id_company,
						dateTime:'',
						key:this.$route.params.key
					},()=>{
						this.roomMessages.push({text: this.textMessage, id: this.$store.state.user.data.id, dateTime:date,hash,id_recipient:this.room[0].id_company,})
						this.textMessage='';
						this.photo=[];
						this.$_vtr_dialogs_scrollBottom();

					});
				}
			},
			$_vtr_dialogs_showDate(index,dateTime){
				const arrMonth = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
				const date = new Date(dateTime);
				const res = date.getDate().toString().padStart(2, '0') + ' ' + arrMonth[date.getMonth()];
				let prevRes='';
				if(index>0){
					const now = new Date(this.roomMessages[index-1].dateTime);
					prevRes = now.getDate().toString().padStart(2, '0') + ' ' + arrMonth[now.getMonth()];
				}
				if(res!==prevRes) return res
				return false
			},
			$_vtr_dialogs_showTime(dateTime){
				const d = new Date(dateTime);
				return d.getHours().toString().padStart(2, '0')+':'+d.getMinutes().toString().padStart(2, '0');
			},
			$_vtr_dialogs_scrollBottom(){
				if(process.env.NODE_ENV!=='development') {
					window.scroll({top: document.body.scrollHeight*1.5, behavior: "smooth"});
				}else{
					this.$nextTick(()=>{this.$refs.blockChat.scrollIntoView()})
				}
			},
			async $_vtr_dialog_addPhoto(){
				let data = new FormData();
				this.loadImgActive=false;
				this.filePhoto.forEach((image,index)=>{
					if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(image.name)) {
						this.$store.commit('notification',"Файл  "+image.name+"  не поддерживается")
						this.filePhoto.splice(index,1)
					}else{
						data.append('file', image);
					}
				})
				let photo=await this.$store.getters.request('POST',this.$store.state.user.settings.server+'photo/chat/'+this.filePhoto.length,data)
				if(photo&&!photo.err){
					setTimeout(()=>{this.photo=this.photo.concat(photo.array_name)},1000)
				}else{
					this.$store.commit('notification',"Прозиошла ошибка, попробуйте позже")
					this.loadImgActive=true
				}
				setTimeout(()=>{this.loadImgActive=true},1000)
				this.$_vtr_dialogs_scrollBottom();
			},
			async $_vtr_dialog_deletePhoto(index,img){
				let photo=await this.$store.getters.request('DELETE',this.$store.state.user.settings.server+'photo/chat/'+img)
				if(photo&&!photo.err){
					this.filePhoto.splice(index,1)
				}
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
			this.roomMessages=this.$store.state.user.messages.filter(message=>message.key===this.$route.params.key).sort((a, b) => {const dateA = new Date(a.dateTime), dateB = new Date(b.dateTime);return dateA.getTime() - dateB.getTime()})
			this.$_vtr_dialogs_scrollBottom()
			if(this.$route.query.type==='manager'){
				this.$store.commit('loginChat',false)
			}
		},
		watch:{
			'$store.state.user.messages'(){
				this.roomMessages=this.$store.state.user.messages.filter(message=>message.key===this.$route.params.key).sort((a, b) => {const dateA = new Date(a.dateTime), dateB = new Date(b.dateTime);return dateA.getTime() - dateB.getTime()})
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
	}
</script>

<style scoped>
	.customSpiner{
		margin-top: 10px;
		margin-right: 5px;
		height: 24px;
		width: 24px;
	}
	.noImg{
		padding: 4px;
	}
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
		margin-bottom: 100px !important;
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
		width: auto;
		height: auto;
		max-height: 80px;
		max-width: 110px;
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
		display: flex;
		width: 72%;
		flex-wrap: wrap;
		margin-right: auto;
	}
	.photoBlockMe{
		display: flex;
		width: 72%;
		flex-wrap: wrap;
		margin-left: auto;
	}
	.photoBlockMe img, .photoBlock img{
		width: 36%;
		height: auto;
		padding: 4px;
		flex: auto;
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
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.whiteBlock{
		padding: 60px 15px;
		overflow-x: hidden;
		overflow-y: scroll;
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
		max-width: 600px;
	}
	.blockSendMessage form{
		flex: auto;
	}
	.blockSendMessage input{
		height: 30px;
		margin-top: 6px;
		border: none;
		padding-left: 10px;
		color: #757575;
		width: 100%;
	}
	.blockSendMessage input:focus{
		outline: none;
	}
</style>
