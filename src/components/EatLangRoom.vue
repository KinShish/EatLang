<template lang="pug">
	div
		div.fixedTop
			h1.title Школа
			.placeImage
				img(src="../assets/story/school.svg")
			.voiceBlock
				.mainAnimBlock
					div
						span(v-for="item in 20")
		.chatBlock
			//transition-group(name="opacity")
			.message.me
				.content
					span Would you like a drink, sir?
			.message.noMe
				.content
					span Yes, a Diet Coke, please.
			.message.me
				.content
					span Ice and lemon?
			.message.noMe
				.content
					span Just lemon.
		div.fixedBottom
			.btnGetVoice
				span(:class="activeVoice?'activeVoice':''" @click="activeVoice=!activeVoice")
					img(src="../assets/mic.svg")
</template>

<script>
	export default {
		data(){
			return{
				activeVoice:false
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
		transition: .3s ease;
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
		width: 100%;
		height: 74px;
		display: flex;
		max-width: 400px;
		margin: 0 auto;
		padding: 10px 0;
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
		margin: 0 auto;
		/*animation: voice 1s linear infinite;*/
	}
	@keyframes voice {
		0%{
			height: 50px;
		}
		100%{
			height: 0;
		}
	}
</style>
