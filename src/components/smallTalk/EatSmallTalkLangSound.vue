<template lang="pug">
	.maxSize.getMargin
		h1.title Опорные слова
		p.subTitle Игра началась. Вам знакомы слова, которые потребуются для диалога?
		p.subTitle Прослушайте и повторите их, чтобы пройти дальше.
		.soundBox
			.item(v-for="word in array")
				img(src="../../assets/speaker.svg")
				span.name(@click="chechWordSound(word.engName)")
					span {{word.engName}}
					span    - {{word.ruName}}
				span.blockImg(@click="sayWord(word.engName+'Say')")
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
			transition(name="opacity") //v-if="arrWord.length===allCountWord"
				button.goToGame(@click="$router.push('/room/2')" ) Начать
</template>

<script>
	export default {
		data(){
			return{
				array:[
					{engName:'be new',ruName:'быть новеньким',pathSound:''},
					{engName:'departament',ruName:'отдел',pathSound:''},
					{engName:'apprentice',ruName:'стажер',pathSound:''},
					{engName:'arrive',ruName:'приезжать, прибывать',pathSound:''},
					{engName:'it\'s lovely',ruName:'прекрасно',pathSound:''},
					{engName:'a but noisy',ruName:'немного шумный',pathSound:''},
					{engName:'I\'m not used to',ruName:'я не привык к...',pathSound:''},
					{engName:'home town',ruName:'родной город',pathSound:''},
					{engName:'What is your... like?',ruName:'дай храктеристику (опиши)',pathSound:''},
					{engName:'quiet',ruName:'тихий',pathSound:''},
					{engName:'not su',ruName:'не такое',pathSound:''},
					{engName:'crowed place',ruName:'многолюдное место',pathSound:''},
					{engName:'I have never been to',ruName:'я никогда не бывал...',pathSound:''},
					{engName:'I\'ve heard a lot about',ruName:'я слышал много об...',pathSound:''},
					{engName:'You chould',ruName:'тебе следует (совет)',pathSound:''},
					{engName:'visit',ruName:'посетить',pathSound:''},
					{engName:'one day',ruName:'однажды',pathSound:''},
					{engName:'I\'m sure',ruName:'я уверен',pathSound:''},
					{engName:'love it',ruName:'понравится',pathSound:''},
				],
				arrWord:[],
				allCountWord:38
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
		min-width: 40px;
		margin-left: 10px;
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
