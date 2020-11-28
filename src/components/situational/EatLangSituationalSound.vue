<template lang="pug">
	.maxSize.getMargin
		h1.title Опорные слова
		p.subTitle Игра началась. Вам знакомы слова, которые потребуются для диалога?
		p.subTitle Прослушайте и повторите их, чтобы пройти дальше.
		.soundBox
			.item
				img(src="../../assets/speaker.svg")
				span.name(@click="chechWordSound('Chruch')")
					span Chruch
					span    - Церковь
				span.blockImg(@click="sayWord('ChruchSay')")
					img(src="../../assets/whiteMic.svg")
			.item
				img(src="../../assets/speaker.svg")
				span.name(@click="chechWordSound('Coffee')")
					span Coffee
					span    - Кофе
				span.blockImg(@click="sayWord('CoffeeSay')")
					img(src="../../assets/whiteMic.svg")
			.item
				img(src="../../assets/speaker.svg")
				span.name(@click="chechWordSound('Office')")
					span Office
					span    - Офис
				span.blockImg(@click="sayWord('OfficeSay')")
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
			transition(name="opacity")
				button.goToGame(@click="$router.push('/room/1')" v-if="arrWord.length===allCountWord") Начать
</template>

<script>
	export default {
		data(){
			return{
				arrWord:[],
				allCountWord:6
			}
		},
		methods:{
			chechWordSound(name){
				if(this.arrWord.indexOf(name)===-1){
					this.arrWord.push(name)
				}
			},
			sayWord(name){
				window.plugins.speechRecognition.startListening(
					()=>{this.chechWordSound(name)},
					()=>{})
			}
		}
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
