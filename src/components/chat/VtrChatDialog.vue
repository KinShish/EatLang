<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Имя пользователя
			span.dottedActive
		.whiteBlock
			span.mainData 20 августа 2020
			.blockMessage
				span.text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit arcu et.
				span.timeMessage 15:35
			.blockMessageMe
				span.timeMessage 15:35
				span.text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit arcu et.
		.blockSendMessage
			img(src="../../assets/chat/chatImage.svg")
			input
			img(src="../../assets/chat/chatSend.svg")
</template>

<script>
	export default {
		name: "VtrChatDialog"
	}
</script>

<style scoped>
	.mainData{
		color: #757575;
		font-size: 12px;
		width: 100%;
		display: block;
		text-align: center;
		margin: 5px 0;
	}
	.timeMessage{
		font-size: 12px;
		color: #757575;
	}
	.blockMessage{
		display: flex;
	}
	.blockMessage .text{
		background: #E6E6E6;
		box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
		border-radius: 3px;
		padding: 10px;
		width: 72%;
		float: left;
		margin: 10px 0;
	}
	.blockMessage .timeMessage{
		margin-top: auto;
		margin-left: 5px;
		margin-bottom: 5px;
	}
	.blockMessageMe{
		display: flex;
	}
	.blockMessageMe .timeMessage{
		width: 28%;
		text-align: right;
		margin-right: 5px;
		margin-top: auto;
		margin-bottom: 10px;
	}
	.blockMessageMe .text{
		background: rgba(246, 70, 70, 0.76);
		box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
		border-radius: 3px;
		padding: 10px;
		width: 72%;
		float: right;
		margin: 10px 0;
		color: white;
	}
	.header{
		position: fixed;
		width: 100%;
		top: 0;
	}
	.whiteBlock{
		margin-top: 50px;
		padding: 0 15px;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	.dottedActive{
		width: 10px;
		height: 10px;
		background: #26C281;
		border-radius: 50%;
		display: inline-block;
		margin-left: 5px;
	}
	.blockSendMessage{
		position: fixed;
		bottom: 0;
		width: 100%;
		background: white;
		height: 50px;
		display: flex;
		box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		padding: 4px 8px;
	}
	.blockSendMessage input{
		flex: auto;
		height: 30px;
		margin-top: 6px;
		border: none;
		padding-left: 10px;
		color: #757575;
	}
	.blockSendMessage input:focus{
		outline: none;
	}
</style>
