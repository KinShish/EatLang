<template lang="pug">
	div
		div.fixedTop
			h1.title Школа
			.placeImage
				img(src="../assets/story/school.svg")
			.voiceBlock
				.mainAnimBlock(:class="activeVoice?'animation':''")
					span(v-for="item in 20")
		.chatBlock
			.message(v-for="message in messages" :class="message.type==='user'?'me':'noMe'")
				.content
					span {{message.text+'   '+JSON.stringify(message.options)}}
			//transition-group(name="opacity")
		div.fixedBottom
			.btnGetVoice
				span(:class="activeVoice?'activeVoice':''" @click="sound()" v-if="$root.platform==='iPhone'")
					img(src="../assets/mic.svg")
				span(:class="activeVoice?'activeVoice':''" v-else @click="startListing()")
					img(src="../assets/mic.svg")
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
						console.log('startListeningSuc',res)
						axios.post('http://192.168.1.23:3000/distance',{text:'Hello Can you help me',arrayTextVoic:res})
							.then(respons=>{
								if(!respons.err){
									this.messages.push({text:respons.data.text,type:"user",options:{phonetics:respons.data.phonetics,grammar:respons.data.grammar,lexicon:respons.data.lexicon}});
									this.messages.push({text:respons.data.answer,type:"bot"});
									this.scrollToDown();
									this.startSound(respons.data.answer)
								}
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
				window.scroll({top: document.body.scrollHeight*1.5, behavior: "smooth"});
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
		top: 0;
	}
	.fixedBottom{
		position: fixed;
		z-index: 1;
		background: white;
		width: 100%;
		bottom: 0;
	}
	.title{
		margin-left: 15px;
		margin-bottom: 0;
	}
	.placeImage img{
		width: 100%;
		height: 200px;
	}
	.btnGetVoice span{
		width: 75px;
		height: 75px;
		display: grid;
		place-content: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
		border-radius: 50%;
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
		background: #36A6E5;
	}
	.voiceBlock{
		width: 85%;
		margin: 15px auto;
	}
	.voiceBlock .mainAnimBlock{
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
		border-radius: 3px;
		height: 74px;
		max-width: 400px;
		margin: 0 auto;
		display: flex;
	}
	.chatBlock{
		position: absolute;
		width: 100%;
		padding: 329px 15px 100px 15px;
	}
	.message{
		width: 100%;
		margin: 20px 0;
	}
	.me{
		color: #36A6E5;
		text-align: right;
		width: 80%;
		margin-left: auto;
	}
	.noMe{
		color: red;
		text-align: left;
		width: 80%;
		margin-right: auto;
	}
	.mainAnimBlock span{
		width: 3px;
		background: #36A6E5;
		display: inline-block;
		margin: auto;
		height: 60px;
		transition: 2s linear;
	}
	.animation span:nth-child(odd){
		animation: voice 1.5s linear infinite;
	}
	.animation span:nth-child(even){
		animation: voice 2.5s linear infinite;
	}
	@keyframes voice {
		0%{
			height: 60px;
		}
		10%{
			height: 50px;
		}
		20%{
			height: 40px;
		}
		30%{
			height: 30px;
		}
		40%{
			height: 20px;
		}
		50%{
			height: 10px;
		}
		60%{
			height: 20px;
		}
		70%{
			height: 30px;
		}
		80%{
			height: 40px;
		}
		90%{
			height: 50px;
		}
		100%{
			height: 60px;
		}
	}
</style>
