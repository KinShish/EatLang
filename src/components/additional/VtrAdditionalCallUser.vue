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
				myVideo:'',
				peerVideo:''
			}
		},
		methods:{
			vtr_callUser_bell(){
				var eventHandlers = {
					'progress': function() {
						console.log('call is in progress');
					},
					'failed': function(e) {
						console.log('call failed with cause: '+ e.data.cause);
					},
					'ended': function(e) {
						console.log('call ended with cause: '+ e.data.cause);
					},
					'confirmed': function() {
						console.log('call confirmed');
					}
				};

				var options = {
					'eventHandlers'    : eventHandlers,
					'mediaConstraints' : { 'audio': true, 'video': true }
				};

				this.$store.state.user.ua.call('sip:1002@192.168.0.205:5060',options);

			}
		},
		created() {
			this.$store.commit('connectUser'); //функция для звонков
		}
	}
</script>

<style scoped>

</style>
