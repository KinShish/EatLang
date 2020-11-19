<template lang="pug">
	div
		h1 звонок
		video(:src="myVideo")
		video(:src="peerVideo")
		button.btnRed(@click="vtr_callUser_bell") Позвонить
</template>

<script>

	export default {
		data(){
			return{
				localClonedStream:'',
				myVideo:'',
				peerVideo:''
			}
		},
		methods:{
			$_vtr_call() {
			}
		},
		created() {

		}
	}
</script>

<style scoped>

</style>
