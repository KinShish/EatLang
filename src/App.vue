<template lang="pug">
	div
		.gameMode(v-if="$route.name==='index'")
			h1.title Выберите режим игры
			.selectGameMode(v-for="mode in mode" :key="mode.title" :class="selectMode===mode.type?'selectGameModeActive':''" @click="selectMode=mode.type")
				h1 {{mode.title}}
				p {{mode.descript}}
			.goToGameBlock
				transition(name="opacity")
					button.goToGame(@click="$_eatLang_go_game" v-if="selectMode!==''") Продолжить
		.header(v-else)
			img(src="./assets/helperHead.svg" @click="$refs.helperModal.show()")
			span(@click="$router.go(-1)") НАЗАД
		transition(name="opacity")
			keep-alive
					router-view
		b-modal(hide-footer ref="helperModal" centered no-close-on-backdrop)
				template(slot="modal-header")
					h4 Задача
					button.close( @click="$refs.helperModal.hide()")
						span(aria-hidden="true") x
				.container
					p Узнайте, как пройти к остановке. Для этого обращайтесь к собеседникам, которых встретите.
</template>

<script>
	export default {
		data(){
			return{
				text:'',
				arrText:[],
				selectMode:'',
				mode:[
					{title:'SMALL TALK',descript:'Непринужденный разговор на отвлеченные темы, которые не предполагают договоренностей, обязательств и т. д.',type:'2'},
					{title:'СИТУАТИВНЫЙ',descript: 'Короткие диалоги в типычных ситуациях речевого общения',type:'1'}
					]
			}
		},
		methods:{
			$_eatLang_go_game(){
				this.$router.push('info/'+this.selectMode)
			},
		},
		created() {
			window.plugins.speechRecognition.requestPermission(
				(requestPermissionSuc)=>{console.log('requestPermission',requestPermissionSuc)} ,
				(requestPermissionErr)=>{console.log('requestPermission',requestPermissionErr)})
		}
	}
</script>

<style scoped>
	.gameMode{
		display: grid;
		place-content: center;
		height: 100%;
		position: absolute;
		width: 100%;
		text-align: center;
		margin-bottom: 30px;
	}
	.selectGameMode{
		border: 1px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.13);
		border-radius: 5px;
		width: 80%;
		margin: 20px auto;
		min-height: 170px;
		transition: .3s ease;
		padding: 10px;
	}
	.selectGameMode h1{
		font-size: 21px;
		color: #26B258;
	}
	.selectGameMode p{
		min-height: 90px;
		display: grid;
		place-content: center;
	}
	.selectGameModeActive {
		border: 1px solid #36A6E5;
		transition: .3s ease;
	}
</style>
