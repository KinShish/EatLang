<template lang="pug">
	div
		audio#remoteAudio(autoPlay)
		VtrAdditionalNotifications
		transition(name="opacity")
			keep-alive(max="20")
				router-view.mainContent(:class="$root.platform==='iPhone'?'iphonePaddingЬainContent':''")
		VtrAdditionalBottomMenu(v-if="$store.state.user.data!=='-1'&&!($route.name==='pin'&&$route.name==='login')&&($route.name==='feed'||$route.name==='search'||$route.name==='add'||$route.name==='chat'||$route.name==='profile')")
</template>

<script>
	import JsSIP from "jssip";

	export default {
		components:{
			VtrAdditionalNotifications :()=>import('./components/additional/VtrAdditionalNotifications'),
			VtrAdditionalBottomMenu:()=>import('./components/additional/VtrAdditionalBottomMenu'),
		},
		methods:{
			$_vtr_main_lazyLoad() {
				let scrollHeight = Math.max(
					document.body.scrollHeight, document.documentElement.scrollHeight,
					document.body.offsetHeight, document.documentElement.offsetHeight,
					document.body.clientHeight, document.documentElement.clientHeight
				);
				console.log()
				return (window.pageYOffset >= (scrollHeight - document.documentElement.clientHeight - 700));
			},
			$_vtr_main_scroll() {
				let oneScroll = 0;
				window.onscroll = () => {
					let twoScroll = window.pageYOffset;
					if (twoScroll > oneScroll && twoScroll > 100) {
						this.scr = true
					}
					if (twoScroll < oneScroll) {
						this.scr = false
					}
					oneScroll = twoScroll;
					this.$root.$emit('lazyLoad', this.$_vtr_main_lazyLoad());
				};
			},
			start(){
				JsSIP.debug.enable('JsSIP:*');
				this.$store.state.user.phone.start();
				this.$store.state.user.phone.on('newRTCSession', function (data) {
					console.log('жопа с ножками ', data)

					const session = data.session;

					session.on('peerconnection', () => {
						console.log("UA session progress Попытка дозвониться");
						playSound("vizov.mp3");
					});
					session.on('progress', () => {
						console.log("Идет дозвон");
						playSound("vizov.mp3");
					});

					session.on('connecting', () => {
						console.log("дозвонился");
						//playSound("vizov.mp3");
						// Тут мы подключаемся к микрофону и цепляем к нему поток, который пойдёт в астер
						let peerconnection = session.connection;
						//let localStream = peerconnection.getLocalStreams()[0];
						// Handle local stream
						//if (localStream) {
						// Clone local stream
						//this.localClonedStream = localStream.clone();

						console.log('UA set local stream');

						//let localAudioControl = document.getElementById("localAudio");
						//localAudioControl.srcObject = this.localClonedStream;
						//}

						// Как только астер отдаст нам поток абонента, мы его засунем к себе в наушники
						peerconnection.addEventListener('addstream', (event) => {
							console.log("UA session addstream");

							let remoteAudioControl = document.getElementById("remoteAudio");
							remoteAudioControl.srcObject = event.stream;
						});
					});
					session.on('failed', (e) => {
						//stopSound("vizov.mp3");
						alert(JSON.stringify(e))
						playSound("rejected.mp3", false);

						//this.callButton.removeClass('d-none');
						//this.hangUpButton.addClass('d-none');
					});
					session.on('ended', () => {
						console.log("UA session ended");
						playSound("rejected.mp3", false);
						//JsSIP.Utils.closeMediaStream(this.localClonedStream);

						//this.callButton.removeClass('d-none');
						//this.hangUpButton.addClass('d-none');
					});
					session.on('accepted', () => {
						console.log('Вам ответили')
						//stopSound("ringback.ogg");
						//playSound("answered.mp3", false);
					});
					//this.stop();
				})
				const playSound = (name) => {
					const audio = new Audio(require('./assets/audio/' + name))
					audio.play()
				}
				/*const stopSound=(name)=>{
					const audio = new Audio(require('../assets/audio/'+name))
					audio.stop()
				}*/
			}
		},
		created() {
			if(localStorage.getItem('token')===null||localStorage.getItem('token')===''){
				this.$router.push('/login')
			}else{
				this.$store.commit('auth')
				this.$_vtr_main_scroll();
			}
			//this.$store.commit('connectUser')
		},
		watch:{
			'$store.state.user.data'(){
				if(this.$store.state.user.data!=='-1'){
					this.$router.push('/pin')
					this.start()
				}else{
					this.$router.push('/login')
				}
			},
			'$store.state.user.errAuth'(){
				if(this.$store.state.user.errAuth){
					this.$router.push('/login')
				}
			}
		},

	}
</script>

<style scoped>
	.iphonePaddingЬainContent{
		margin-bottom: 20px !important;
	}
	.mainContent{
		max-width: 600px;
		height: auto;
		margin: 0 auto;
		position: absolute;
		width: 100%;
		right: 0;
		left: 0;
	}
</style>
