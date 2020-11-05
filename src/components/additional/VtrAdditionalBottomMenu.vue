<template lang="pug">
	.mainBlockMenu(:class="$root.platform==='iPhone'?'iphonePadding':''")
		audio#localAudio(autoPlay muted)
		audio#remoteAudio(autoPlay)
		audio#sounds(autoPlay)
		//audio(:srcObject.prop="localMedia" autoplay)
		//audio(:srcObject.prop="remoteMedia" autoplay)
		//button(@click="$_vtr_answer") Поднять
		button(@click="$_vtr_call") Позвонить
		router-link(to="/feed")
			div(@click="$_vtr_menu_aimationMenuIcon('menuFeed')")
				img(:src="$route.name==='feed'?images.feedActive:images.feed" ref="menuFeed")
				span(:class="$route.name==='feed'?'redColor':''") Главная
		router-link(to="/search")
			div(@click="$_vtr_menu_aimationMenuIcon('menuSearch')")
				img(:src="$route.name==='search'?images.searchActive:images.search" ref="menuSearch")
				span(:class="$route.name==='search'?'redColor':''") Поиск
		router-link(to="/add")
			div(@click="$_vtr_menu_aimationMenuIcon('menuAdd')")
				img(:src="$route.name==='add'?images.addActive:images.add" ref="menuAdd")
				span(:class="$route.name==='add'?'redColor':''") Добавить
		router-link(to="/chat")
			div(@click="$_vtr_menu_aimationMenuIcon('menuChat')")
				img(:src="$route.name==='chat'?images.chatActive:images.chat" ref="menuChat")
				span(:class="$route.name==='chat'?'redColor':''") Чат
		router-link(to="/profile")
			div(@click="$_vtr_menu_aimationMenuIcon('menuProfile')")
				img(:src="$route.name==='profile'?images.profileActive:images.profile" ref="menuProfile")
				span(:class="$route.name==='profile'?'redColor':''") Профиль
</template>

<script>
	import JsSIP from 'jssip'
	import feed from '../../assets/menuImg/feed.svg'
	import feedActive from '../../assets/menuImg/feedActive.svg'
	import search from '../../assets/menuImg/search.svg'
	import searchActive from '../../assets/menuImg/searchActive.svg'
	import add from '../../assets/menuImg/add.svg'
	import addActive from '../../assets/menuImg/addActive.svg'
	import chat from '../../assets/menuImg/chat.svg'
	import chatActive from '../../assets/menuImg/chatActive.svg'
	import profile from '../../assets/menuImg/profile.svg'
	import profileActive from '../../assets/menuImg/profileActive.svg'
	const socket =new JsSIP.WebSocketInterface('ws://192.168.0.205:8081');
	const configuration = {
		sockets: [socket],
		uri: 'sip:1000@192.168.0.205',
		password: 'A123456789',
		session_timers: false
	};
	export default {
		data(){
			return{
				localClonedStream:'',
				coolPhone:new JsSIP.UA(configuration),
				images:{
					feed: feed,
					feedActive:feedActive,
					search:search,
					searchActive:searchActive,
					add:add,
					addActive:addActive,
					chat:chat,
					chatActive:chatActive,
					profile:profile,
					profileActive:profileActive
				}
			}
		},
		methods:{
			$_vtr_menu_aimationMenuIcon(e){
				this.$refs[e].classList.add('sizeImgBtn');
				setTimeout(()=> {this.$refs[e].classList.remove('sizeImgBtn')}, 700);
			},
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

				const session = this.coolPhone.call('sip:1002@192.168.0.205', options);
				console.log(session)
			}
		},
		async created(){
			JsSIP.debug.enable('JsSIP:*');
            await this.coolPhone.start();
			this.coolPhone.on('newRTCSession', function(data) {
                console.log('жопа с ножками ',data)
                //var originator = data.originator;
                var session = data.session;
                //var request = data.request;
                session.on('peerconnection', () => {
                    console.log("UA session progress");
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
                    let localStream = peerconnection.getLocalStreams()[0];
                    // Handle local stream
                    if (localStream) {
                        // Clone local stream
                        this.localClonedStream = localStream.clone();

                        console.log('UA set local stream');

                        let localAudioControl = document.getElementById("localAudio");
                        localAudioControl.srcObject = this.localClonedStream;
                    }

                    // Как только астер отдаст нам поток абонента, мы его засунем к себе в наушники
                    peerconnection.addEventListener('addstream', (event) => {
                        console.log("UA session addstream");

                        let remoteAudioControl = document.getElementById("remoteAudio");
                        remoteAudioControl.srcObject = event.stream;
                    });
                });

// Дозвон завершился неудачно, например, абонент сбросил звонок
                session.on('failed', (data) => {
                    console.log("UA session failed",data);
                    stopSound("vizov.mp3");
                    playSound("rejected.mp3", false);

                    //this.callButton.removeClass('d-none');
                    //this.hangUpButton.addClass('d-none');
                });

                // Поговорили, разбежались
                session.on('ended', () => {
                    console.log("UA session ended");
                    playSound("rejected.mp3", false);
                    JsSIP.Utils.closeMediaStream(this.localClonedStream);

                    //this.callButton.removeClass('d-none');
                    //this.hangUpButton.addClass('d-none');
                });

                // Звонок принят, можно начинать говорить
                session.on('accepted', () => {
                    console.log("UA session accepted");
                    stopSound("ringback.ogg");
                    playSound("answered.mp3", false);
                });
                //this.stop();
            })
            // Register callbacks to desired call events
            const playSound=(name)=>{
				console.log(name)
                const audio = new Audio(require('../../assets/audio/vizov.mp3'))
                audio.play()
            }
            const stopSound=(name)=>{
                const audio = new Audio(require(name))
                audio.stop()
            }



        }
	}
</script>

<style scoped>
	.redColor{
		color: red;
		transition: .3s ease;
	}
	.sizeImgBtn{
		animation: sizeimg .8s;
	}
	@keyframes sizeimg {
		0% {
			transform: scale(.7);

		}
		50% {
			transform: scale(1.2);

		}

		100% {
			transform: scale(1);

		}
	}
	.iphonePadding{
		padding-bottom: 10px;
		height: 70px !important;
	}
	.mainBlockMenu{
		position: fixed;
		bottom: 0;
		width: 100%;
		background: white;
		height: 60px;
		display: flex;
		box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		padding-top: 10px;
	}
	.mainBlockMenu a{
		flex: 1;
		text-align: center;
		color: black;
		font-weight: normal;
		font-size: 13px;
	}
	.mainBlockMenu a:hover ,a:focus, a:active {
		text-decoration: none;
		color: black;
		outline: none;
	}
	.mainBlockMenu span{
		display: block;
	}
</style>
