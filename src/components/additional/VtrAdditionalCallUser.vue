<template lang="pug">
	div
		h1 звонок
		video(:src="myVideo")
		video(:src="peerVideo")
		button.btnRed(@click="vtr_callUser_bell") Позвонить
</template>

<script>
	import JsSIP from 'jssip'
	const socket =new JsSIP.WebSocketInterface('ws://176.110.138.119:5081');
	const configuration = {
		sockets: [socket],
		outbound_proxy_set: 'ws://176.110.138.119:5081',
		uri: 'sip:1004@176.110.138.119:5080',
		password: 'A123456789',
		session_timers: false,
		register: true
	};
	export default {
		data(){
			return{
				localClonedStream:'',
				coolPhone:new JsSIP.UA(configuration),
				myVideo:'',
				peerVideo:''
			}
		},
		methods:{
			$_vtr_call(){
				const eventHandlers = {
					'progress': function(e) {
						console.log('call is in progress',e);
					},
					'failed': function(e) {
						console.log('call failed with cause: '+ e);
					},
					'ended': function(e) {
						console.log('call ended with cause: '+ e);
					},
					'confirmed': function(e) {
						console.log('call confirmed',e);
					}
				};

				const options = {
					pcConfig: {
						hackStripTcp: true, // Важно для хрома, чтоб он не тупил при звонке
						iceServers: []
					},
					rtcOfferConstraints: {
						offerToReceiveAudio: 1, // Принимаем только аудио
						offerToReceiveVideo: 0
					},
					eventHandlers    : eventHandlers,
					mediaConstraints : { audio: true, video: false }
				};

				this.coolPhone.call('sip:1000@176.110.138.119', options);
			}
		},
		created() {
			JsSIP.debug.enable('JsSIP:*');
			this.coolPhone.start();
			this.coolPhone.on('newRTCSession', function(data) {
				console.log('жопа с ножками ',data)
				//var originator = data.originator;
				var session = data.session;
				//var request = data.request;
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
					JsSIP.Utils.closeMediaStream(this.localClonedStream);

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
			const playSound=(name)=>{
				const audio = new Audio(require('../../assets/audio/'+name))
				audio.play()
			}
			/*const stopSound=(name)=>{
				const audio = new Audio(require('../../assets/audio/'+name))
				audio.stop()
			}*/
		}
	}
</script>

<style scoped>

</style>
