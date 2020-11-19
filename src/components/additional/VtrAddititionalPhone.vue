<template lang="pug">
	div
		.titleName Имя кого бы то ни было
		.fastBtnGood
			.fastButtonBlock
				button.fastButton(@click="call()") Позвонить
				button.fastButton(@click="call()") Закончить
</template>

<script>

	export default {
		methods:{
			call(){
				const eventHandlers = {
					'progress': function (e) {
						console.log('call is in progress', e);
					},
					'failed': function (e) {
						console.log('call failed with cause: ' + e);
					},
					'ended': function (e) {
						console.log('call ended with cause: ' + e);
					},
					'confirmed': function (e) {
						console.log('call confirmed', e);
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
					eventHandlers: eventHandlers,
					mediaConstraints: {audio: true, video: false}
				};
				this.$store.state.user.phone.call('sip:1001@sip.alna.ru', options);
			},
		}
	}
</script>

<style scoped>
	.fastBtnGood{
		position: fixed;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
		bottom: 25px;
	}
	.fastButtonBlock{
		padding: 7px;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		width: 95%;
		margin: 0 auto;
		max-width: 600px;
		text-align: center;
		display: flex;
	}
	.fastButton{
		display: block;
		outline: none;
		border: 2px solid #F64646;
		background: #F64646;
		color: white;
		border-radius: 3px;
		padding: 5px 10px;
		font-size: 16px;
		margin: 0 auto;
		width: 45%;
	}
	.titleName{
		text-align: center;
		width: 100%;
		font-size: 25px;
	}
</style>
