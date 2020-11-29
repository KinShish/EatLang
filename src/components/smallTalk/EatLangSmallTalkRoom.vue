<template lang="pug">
	div
		div.fixedTop
			.placeImage
				img(src="../../assets/story/room2Girl.svg")
		.chatBlock
			.message(v-for="message in messages" :class="message.type==='user'?'me':'noMe'")
				.content
					span {{message.text}}
				.keyWords(v-if="message.type!=='user'")
					span.wordDesc Используйте опорные слова:
					span.word(v-for="word in message.words") {{word}}
				.raitingMessage(v-else)
					.raitingItem
						img(src="../../assets/rating/phoneticsGreen.svg")
						span {{message.options.phonetics+'%'}}
					.raitingItem
						img(src="../../assets/rating/grammarGreen.svg")
						span {{message.options.grammar+'%'}}
					.raitingItem
						img(src="../../assets/rating/vocabularyGreen.svg")
						span {{message.options.lexicon+'%'}}
			div(ref="bottom")
		div.fixedBottom
			.btnGetVoice
				span(:class="activeVoice?'activeVoice':''" @click="sound()" v-if="$root.platform==='iPhone'")
					img(src="../../assets/whiteMic.svg")
				span(:class="activeVoice?'activeVoice':''" v-else @click="startListing()")
					img(src="../../assets/whiteMic.svg")
		b-modal(hide-footer ref="endGame" centered no-close-on-backdrop)
			template(slot="modal-header")
				h4 The theme is completed
				button.close( @click="$refs.endGame.hide()")
					span(aria-hidden="true") x
			.container
				p Congratulate!
</template>
<script>
	import axios from 'axios'
	import name from '../../sounds/1_Hi. My name.mp3'
	import expert from '../../sounds/2_Im an expert.mp3'
	import where from '../../sounds/3_Where do you.mp3'
	import grate from '../../sounds/4_Grate.mp3'
	import enjoy from '../../sounds/5_Do you enjoy.mp3'
	import home from '../../sounds/6_What is your home.mp3'
	import never from '../../sounds/7_I have never.mp3'
	import hope from '../../sounds/8_I hope.mp3'
	export default {
		data(){
			return{
				distance:'',
				activeVoice:false,
				messages:[],
				questions_id:0,
				questions:[
					{text:'Hi. My name is Zhenya. That is you name?',voice:name,words:['имя','Алекс','Приветствие']},
					{text:'I\'m an expert from the case 3. I represent compony "Rostelecom". You are new here. Which department do you work?',voice:expert,words:['быть новеньким','отдел']},
					{text:'Where do you come from?',voice:where,words:['из России','стажер']},
					{text:'O! Grate! When did you arrive?',voice:grate,words:['прибыл','прошлая неделя']},
					{text:'Do you enjoy the city?',voice:enjoy,words:['это прекрасно','немного шумно','не привык к такому шуму','родной город']},
					{text:'What is your home town like?',voice:home,words:['тихий','многолюдное место','Север России','место']},
					{text:'I have never been to Russia but I\'ve heard a lot about it.',voice:never,words:['должны посетить','однажды','уверен','понравится']},
					{text:'I hope I will.',voice:hope,words:[]},
				],
			}
		},
		methods:{
			sound(){
				this.activeVoice=!this.activeVoice
				if(this.activeVoice) {
					this.startListing()
				}else{
					this.stopListing()
				}
			},
			startListing(){
				let options = {
					language:'en-US',
					matches:10,
					showPartial:false
				}
				this.activeVoice=!this.activeVoice;
				window.plugins.speechRecognition.startListening(
					async (res)=>{
						this.activeVoice=!this.activeVoice;
						axios.post('http://01taxi.ru/eatlern/'+this.questions_id,{arrayTextVote:res})
							.then(respons=>{
								if(!respons.data.err){
									this.messages.push({
										text:respons.data.text,
										type:"user",
										options:{
											phonetics:respons.data.phonetics,
											grammar:respons.data.grammar,
											lexicon:respons.data.lexicon
										}});
									if(respons.data.result){
										this.questions_id++;
										this.messages.push({text:this.questions[this.questions_id].text,type:"bot",words:this.questions[this.questions_id].words});
										this.playAudio(this.questions[this.questions_id].voice)
									}else{
										this.messages.push({text:respons.data.answer,type:"bot",words:this.questions[this.questions_id].words});
										this.startSound(respons.data.answer)
									}
									this.scrollToDown();
									if(this.questions_id===7){ //Модальное окно конца
										setTimeout(()=>{
											this.$refs.endGame.show();
										},5000)
									}
								}
								this.distance=JSON.stringify(respons)
							}).catch(e=>console.log(e))
					},
					(res)=>{console.log('startListeningBad',res)},options)
			},
			stopListing(){
				window.plugins.speechRecognition.stopListening(
					(res)=>{console.log('stopListeningSuc',res)},
					(res)=>{console.log('stopListeningBad',res)},)
			},
			playAudio(file){
				const audio = new Audio(file)
				audio.play()
			},
			startSound(text){
				// eslint-disable-next-line no-undef
				TTS
					.speak({
						text: text,
						locale: 'en-US',
						rate: 0.6,
						pitch: 1,
						cancel: true
					})
			},
			scrollToDown(){
				this.$nextTick(()=>{
					if(this.$refs.bottom) this.$refs.bottom.scrollIntoView()
				})
				if(process.env.NODE_ENV!=='development') {
					window.scroll({top: document.body.scrollHeight*1.5, behavior: "smooth"});
				}
			},
			sayErrorNo(){
				axios.get('http://01taxi.ru/distance/auth')
					.then(respons=>{
						console.log(respons)
					}).catch(e=>console.log(e))

			}
		},
		mounted() {
			this.sayErrorNo();
			setTimeout(()=>{
				this.messages.push({text:this.questions[0].text,type:"bot",words:this.questions[0].words});
				this.playAudio(this.questions[0].voice)
			},3000)
		}
	}
</script>

<style scoped>
	.fixedTop{
		position: fixed;
		z-index: 1;
		background: white;
		width: 100%;
		top: 40px;
	}
	.fixedBottom{
		position: fixed;
		z-index: 1;
		background: white;
		width: 100%;
		bottom: 0;
	}
	.placeImage img{
		width: 100%;
		max-height: 300px;
	}
	.btnGetVoice span{
		width: 75px;
		height: 75px;
		display: grid;
		place-content: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
		border-radius: 50%;
		transition: .3s ease;
		background: #15CC5E;
	}
	.btnGetVoice img{
		height: 50px;
	}
	.btnGetVoice{
		display: grid;
		place-content: center;
		bottom: 0;
		position: absolute;
		width: 100%;
		z-index: 1;
		background: white;
		padding: 5px 0;
	}
	.activeVoice{
		background: #36A6E5 !important;
	}
	.chatBlock{
		position: absolute;
		width: 100%;
		padding: 300px 15px 100px 15px;
	}
	.message{
		width: 100%;
		margin: 20px 0;
		word-break: break-word;
		display: block;
	}
	.me .content{
		color: #15CC5E;
		text-align: right;
		margin-left: auto;
		background: #FFFFFF;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.13);
		border-radius: 5px;
		width: fit-content;
		max-width: 80%;
		padding: 10px;
	}
	.noMe{
		color: #36A6E5;
		text-align: left;
		margin-right: auto;
		background: #FFFFFF;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.13);
		border-radius: 5px;
		width: -webkit-fit-content;
		width: -moz-fit-content;
		width: fit-content;
		max-width: 80%;
		padding: 10px;
		margin-top: 50px;
	}
	.wordDesc{
		color: #757575;
		font-size: 12px;
		display: block;
		margin-top: 10px;
	}
	.word{
		color: #15CC5E;
		font-size: 12px;
		display: block;
		margin-bottom: 5px;
	}
	.raitingMessage{
		display: flex;
		float: right;
		line-height: 30px;
		font-size: 12px;
		color: #15CC5E;
		padding: 10px 0;
	}
	.raitingItem img{
		height: 20px;
		margin-right: 5px;
	}
	.raitingItem{
		margin: 0 10px;
	}
</style>
