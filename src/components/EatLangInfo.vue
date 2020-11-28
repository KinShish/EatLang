<template lang="pug">
	div
		.title Добраться до достопримечательности
		p.dopInfo Перед тем, как двигаться дальше, изучите фразы:
		.infoBlocl
			p.info 1. Can you help me
			p.info 2. What can I visit in your city','What can I visit in your town','What can I visit in your place','What intresting places can I visit in your city
			p.info 3. Where is this church','Where is located this church
			p.info 4. How can I get this church
		.goToGameBlock
			button.goToGame(@click="$_eatLang_go_game") Продолжить
</template>

<script>
	export default {
		methods:{
			$_eatLang_go_game(){
				this.$router.push('map/1')
			}
		}
	}
</script>

<style scoped>
	.infoBlocl{
		width: 80%;
		padding: 0 15px;
	}
	.info{
		color: #26B258;
		font-size: 14px;
	}
	.dopInfo{
		text-align: center;
		font-size: 12px;
		color: #757575;
	}
	.title{
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.13);
		border-radius: 5px;
		width: 80%;
		margin: 20px auto;
		text-align: center;
		padding: 10px;
	}
	.goToGameBlock{
		height: 100px;
	}
	.goToGame{
		margin: 0 auto;
		background: #36A6E6;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.13);
		border-radius: 7px;
		color: white;
		width: 80%;
		padding: 2% 0;
		max-height: 40px;
		display: grid;
		place-content: center;
		margin-top: 50px;
		outline: none;
		border:2px solid #36A6E6;
		transition: .3s ease;
	}
	button.goToGame:active{
		border-color: #36A6E6;
		background: white;
		color: #36A6E6;
	}
</style>
