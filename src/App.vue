<template lang="pug">
	div
		//keep-alive
			EatLangMain
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
	export default {
		data(){
			return{
				text:'',
				arrText:[]
			}
		},
		components:{
			'EatLangMain':()=>import('./components/EatLangMain'),
		},
		methods:{
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
					(res)=>{console.log('startListeningSuc',res);this.arrText=res;this.text=this.arrText[0]},
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

</style>
