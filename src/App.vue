<template lang="pug">
	div
		.gameMode(v-if="$route.name==='index'")
			h1.title Выберите режим игры
			.selectGameMode(v-for="mode in mode" :key="mode.title" :class="selectMode===mode.type?'selectGameModeActive':''" @click="selectMode=mode.type")
				h1 {{mode.title}}
				p {{mode.descript}}
			transition(name="opacity")
				button.goToGame(@click="$_eatLang_go_game" v-if="selectMode!==''") Продолжить
		transition(name="opacity")
			keep-alive
					router-view
		button.col-12(@click="sayEn") en
		button.col-12(@click="sayRu") ru
		input.col-12(v-model="text")
		button.col-12(@click="testmic") testmic
		.row
			button.col-6(@click="startListing") start
			button.col-6(@click="stopListing") stop
		span.col-12 {{arrText}}
</template>

<script>
	import axios from 'axios'
	export default {
		data(){
			return{
				text:'',
				arrText:[],
				distance:'',
				selectMode:'',
				mode:[
					{title:'SMALL TALK',descript:'Непринужденный разговор на отвлеченные темы, которые не предполагают договоренностей, обязательств и т. д.',type:'1'},
					{title:'СИТУАТИВНЫЙ',descript: 'Короткие диалоги в типычных ситуациях речевого общения',type:'2'}
					]
			}
		},
		components:{
			'EatLangMain':()=>import('./components/EatLangMain'),
		},
		methods:{
			$_eatLang_go_game(){
				this.$router.push('map/'+this.selectMode)
			},
			sayRu(){
				// eslint-disable-next-line no-undef
				TTS
					.speak({
						text: this.text,
						locale: 'ru-ru',
						rate: 0.4,
						pitch: 1.3,
						cancel: true
					})
			},
			sayEn(){
				// eslint-disable-next-line no-undef
				TTS
					.speak({
						text: this.text,
						locale: 'en-US',
						rate: 0.4,
						pitch: 1.3,
						cancel: true
					})
			},
			test(type){
				alert(type)
			},
			startListing(){
				let options = {
					language:'en-US',
					matches:100,
					showPartial:true
				}
				window.plugins.speechRecognition.startListening(
					async (res)=>{
						console.log('startListeningSuc',res);this.arrText=res;this.text=this.arrText[0]
						axios.post('http://192.168.1.23:3000/distance',{text:['Hello','Can you help me'],arrayTextVoic:res})
							.then(respons=>{
								alert(respons);
								this.distance=JSON.stringify(respons)
							}).catch(e=>alert(e))

					},
					(res)=>{console.log('startListeningBad',res)},options)
			},
			stopListing(){
				window.plugins.speechRecognition.stopListening(
					(res)=>{console.log('stopListeningSuc',res)},
					(res)=>{console.log('stopListeningBad',res)},)
			},
			testmic(){
				// eslint-disable-next-line no-undef
				window.plugins.speechRecognition.requestPermission(
					(requestPermissionSuc)=>{console.log('requestPermission',requestPermissionSuc)} ,
					(requestPermissionErr)=>{console.log('requestPermission',requestPermissionErr)})
			}
		},
	}
</script>

<style scoped>
	.gameMode{
		display: grid;
		place-content: center;
		height: 100%;
		position: absolute;
		width: 100%;
		text-align: center;
	}
	.selectGameMode{
		border: 1px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.13);
		border-radius: 5px;
		width: 80%;
		margin: 20px auto;
		min-height: 170px;
		transition: .3s ease;
		padding: 10px;
	}
	.selectGameMode h1{
		font-size: 21px;
		color: #26B258;
	}
	.selectGameMode p{
		min-height: 90px;
		display: grid;
		place-content: center;
	}
	.selectGameModeActive {
		border: 1px solid #36A6E5;
		transition: .3s ease;
	}
	.goToGame{
		margin: 0 auto;
		background: #36A6E6;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.13);
		border-radius: 7px;
		color: white;
		width: 80%;
		padding: 2% 0;
		max-height: 40px;
		display: grid;
		place-content: center;
		margin-top: 50px;
		outline: none;
		border:2px solid #36A6E6;
		transition: .3s ease;
	}
	button.goToGame:active{
		border-color: #36A6E6;
		background: white;
		color: #36A6E6;
	}
</style>
