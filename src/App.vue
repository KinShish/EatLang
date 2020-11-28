<template lang="pug">
	div
		.maxSize(v-if="$route.name==='index'")
			img.logo(src="./assets/logo.svg")
			.chatBlockIndex
				.messageChatIndex
					span Привет!
					span Это приложение поможет отработать навыки устной речи.
				.messageChatIndex
					span Выбирай ситуацию, слушай собеседника и отвечай в микрофон.
				.messageChatIndex
					span Будь понятым и оцени свои успехи по трем критериям: грамматика, лексика и фонетика
			.goToGameBlock
				button.goToGame(@click="$router.push('/gameMode')") Начать
		.header(v-else-if="$route.name!=='end'")
			span(@click="$router.go(-1)") НАЗАД
		transition(name="opacity")
			keep-alive
					router-view
</template>

<script>
	export default {
		created() {
			window.plugins.speechRecognition.requestPermission(
				(requestPermissionSuc)=>{console.log('requestPermission',requestPermissionSuc)} ,
				(requestPermissionErr)=>{console.log('requestPermission',requestPermissionErr)})
		}
	}
</script>

<style scoped>
	.logo{
		margin: 20px auto;
		display: block;
	}
	.chatBlockIndex{
		max-width: 600px;
		padding: 0 15px;
	}
	.messageChatIndex{
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.13);
		border-radius: 5px;
		width: 70%;
		display: block;
		padding: 20px;
		margin: 15px 0;
		text-align: left;
		color:#1F8CC9;
	}
	.messageChatIndex span{
		display: block;
	}
	.messageChatIndex:nth-child(2){
		margin-left: auto;
		color: #15CC5E;
		text-align: right;
	}
</style>
