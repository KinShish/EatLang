<template lang="pug">
	.maxSize.getMargin
		h1.title Опорные слова
		p.subTitle Игра началась. Вам знакомы слова, которые потребуются для диалога?
		p.subTitle Прослушайте и повторите их, чтобы пройти дальше.
		.soundBox
			.item(v-for="word in array")
				img(src="../../assets/speaker.svg")
				span.name(@click="clickWordSound(word.engName,word.sound)")
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
	import benew from '../../sounds/words/1_be new.mp3'
	import departament from '../../sounds/words/2_department.mp3'
	import apprentice from '../../sounds/words/3_apprentice.mp3'
	import arrive from '../../sounds/words/4_arrive.mp3'
	import lovely from '../../sounds/words/5_its lovely.mp3'
	import noisy from '../../sounds/words/6_a bit noisy.mp3'
	import used from '../../sounds/words/7_Im not used to.mp3'
	import home from '../../sounds/words/8_home town.mp3'
	import like from '../../sounds/words/9_What is your… like.mp3'
	import quiet from '../../sounds/words/10_quiet.mp3'
	import notso from '../../sounds/words/11_not so.mp3'
	import crowed from '../../sounds/words/12_crowed place.mp3'
	//import north from '../../sounds/words/13_in the north.mp3'
	import never from '../../sounds/words/14_I have never been to.mp3'
	import heard from '../../sounds/words/15_Ive heard a lot about.mp3'
	import should from '../../sounds/words/16_You should.mp3'
	import visit from '../../sounds/words/17_visit.mp3'
	import day from '../../sounds/words/18_one day.mp3'
	import sure from '../../sounds/words/19_Im sure.mp3'
	import love from '../../sounds/words/20_love it.mp3'
	export default {
		data(){
			return{
				array:[
					{engName:'be new',ruName:'быть новеньким',sound:benew},
					{engName:'departament',ruName:'отдел',sound:departament},
					{engName:'apprentice',ruName:'стажер',sound:apprentice},
					{engName:'arrive',ruName:'приезжать, прибывать',sound:arrive},
					{engName:'it\'s lovely',ruName:'прекрасно',sound:lovely},
					{engName:'a but noisy',ruName:'немного шумный',sound:noisy},
					{engName:'I\'m not used to',ruName:'я не привык к...',sound:used},
					{engName:'home town',ruName:'родной город',sound:home},
					{engName:'What is your... like?',ruName:'дай храктеристику (опиши)',sound:like},
					{engName:'quiet',ruName:'тихий',sound:quiet},
					{engName:'not su',ruName:'не такое',sound:notso},
					{engName:'crowed place',ruName:'многолюдное место',sound:crowed},
					{engName:'I have never been to',ruName:'я никогда не бывал...',sound:never},
					{engName:'I\'ve heard a lot about',ruName:'я слышал много об...',sound:heard},
					{engName:'You chould',ruName:'тебе следует (совет)',sound:should},
					{engName:'visit',ruName:'посетить',sound:visit},
					{engName:'one day',ruName:'однажды',sound:day},
					{engName:'I\'m sure',ruName:'я уверен',sound:sure},
					{engName:'love it',ruName:'понравится',sound:love},
				],
				arrWord:[],
				allCountWord:38
			}
		},
		methods:{
			clickWordSound(name,file){
				const audio = new Audio(file)
				audio.play()
				this.chechWordSound(name)
			},
			chechWordSound(name){
				if(this.arrWord.indexOf(name)===-1){
					this.arrWord.push(name)
				}
			},
			sayWord(name){
				let options = {
					language:'en-US',
					matches:10,
					showPartial:false
				}
				window.plugins.speechRecognition.startListening(
					()=>{this.chechWordSound(name)},
					()=>{},options)
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
		margin: auto;
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
