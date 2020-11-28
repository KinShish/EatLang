<template lang="pug">
	.getMargin
		img.titleImage(src="../../assets/story/room2.svg")
		.title НОВИЧОК НА КОФЕ БРЕЙК
		p.decript Вы Алекс - новичок, стажер в IT отделе финала «Цифрового прорыва» в ньюйоркском офисе.
		p.decript Прилетели из России на прошлой неделе.
		p.decript Ваша родина – тихий и малонаселенный город на Севере России.
		p.decript К вам подошел познакомиться коллега, поддержите разговор. Если ваши ответы будут непонятны собеседнику он не сможет вам ответить.
		.goToGameBlock
			button.goToGame(@click="$router.push('/sound/2')") Продолжить
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
