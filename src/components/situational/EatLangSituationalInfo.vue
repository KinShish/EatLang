<template lang="pug">
	.getMargin
		img.titleImage(src="../../assets/story/street.svg")
		.title ДОБРАТЬСЯ ДО ДОСТОПРИМЕЧАТЕЛЬНОСТИ
		p.decript Вы приехали в новый город и хотите посетить его главную достопримечательность. Расспросите у прохожего, что является главной достопримечательностью города и как туда добраться. Если ваши ответы будут непонятны собеседнику он не сможет вам ответить.
		.goToGameBlock
			button.goToGame(@click="$router.push('/sound/1')") Продолжить
</template>

<script>
</script>

<style scoped>
	.decript{
		width: 80%;
		margin: 0 auto;
		max-width: 600px;
		color: #757575;
	}
	.titleImage{
		width: 100%;
		max-height: 300px;
	}
	.title{
		color: #15CC5E;
		font-size: 18px;
		text-align: center;
		margin-top: 15px;
	}
</style>
