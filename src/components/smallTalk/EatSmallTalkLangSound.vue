<template lang="pug">
	div
		h1.title Опорные слова
		p.subTitle Опорные слова, которые рекомендуется использовать в данной теме.
		p.subTitle Вы можете изучить их и прослушать, а также можете проверить своё произношение.
		.soundBox
			.item
				img(src="../../assets/speaker.svg")
				span.name
					span Chruch
					span    - Церковь
				span.blockImg
					img(src="../../assets/whiteMic.svg")
			.item
				img(src="../../assets/speaker.svg")
				span.name
					span Coffee
					span    - Кофе
				span.blockImg
					img(src="../../assets/whiteMic.svg")
			.item
				img(src="../../assets/speaker.svg")
				span.name
					span Office
					span    - Офис
				span.blockImg
					img(src="../../assets/whiteMic.svg")
		p.subTitleTo Также каждое ваше предложение будет оцениваться по трём параметрам:
		.ratingBlock
			.item
				img(src="../../assets/rating/phonetics.svg")
				span Фонетика
			.item
				img(src="../../assets/rating/vocabulary.svg")
				span Лексика
			.item
				img(src="../../assets/rating/grammar.svg")
				span Грамматика
		.goToGameBlock
			button.goToGame(@click="$router.push('/room/2')") Начать
</template>

<script>
	export default {

	}
</script>

<style scoped>
	.title{
		text-align: center;
	}
	.subTitle{
		width: 80%;
		text-align: center;
		color: #757575;
		margin: 0 auto;
		font-size: 12px;
	}
	.subTitleTo{
		width: 100%;
		color: #757575;
		margin: 0 auto;
		font-size: 12px;
		padding: 0 15px;
	}
	.soundBox{
		width: 100%;
		max-width: 600px;
		padding: 30px 15px;
	}
	.soundBox .item{
		display: flex;
		line-height: 40px;
		margin-bottom: 15px;
	}
	.soundBox .item .name{
		flex: auto;
		padding-left: 15px;
	}
	.soundBox .item .name span:nth-child(1){
		color: #15CC5E;
		text-decoration: underline;
	}
	.soundBox .item .blockImg{
		background: #15CC5E;
		padding: 5px;
		width: 40px;
		height: 40px;
		display: grid;
		place-content: center;
		border-radius: 3px;
	}
	.soundBox .item .blockImg img{
		height: 30px;
	}
	.ratingBlock{
		width: 100%;
		max-width: 600px;
		padding: 30px 15px;
	}
	.ratingBlock .item{
		display: flex;
		line-height: 40px;
		margin-bottom: 15px;
	}
	.ratingBlock .item img{
		height: 40px;
		width: 40px;
		margin-right: 15px;
		display: block;
	}
	.ratingBlock .item span{
		color: #1F8CC9;
		font-size: 20px;
	}
</style>
