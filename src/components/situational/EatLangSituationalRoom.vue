<template lang="pug">
	div
		div.fixedTop
			.placeImage
				img(src="../../assets/story/streetGirl.svg")
		.chatBlock
			.message(v-for="message in messages" :class="message.type==='user'?'me':'noMe'")
				.content
					span {{message.text}}
				.keyWords(v-if="message.type!=='user'")
					span.wordDesc Используйте опорные слова:
					span.word Hello
					span.word Hello
					span.word Hello
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
</template>

<script>
	import axios from 'axios'
	export default {
		data(){
			return{
				distance:'',
				activeVoice:false,
				messages:[],
			}
		},
		mounted() {
			this.sayErrorNo();
		},
		methods:{
			sayErrorNo(){
				axios.get('http://01taxi.ru/distance/auth')
					.then(respons=>{
						console.log(respons)
					}).catch(e=>console.log(e))

			},
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
						axios.post('http://01taxi.ru/eatlern',{arrayTextVoic:res})
							.then(respons=>{
								if(!respons.err){
									this.messages.push({text:respons.data.text,type:"user",options:{phonetics:respons.data.phonetics,grammar:respons.data.grammar,lexicon:respons.data.lexicon}});
									this.messages.push({text:respons.data.answer,type:"bot"});
									this.scrollToDown();
									this.startSound(respons.data.answer)
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
			}
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
