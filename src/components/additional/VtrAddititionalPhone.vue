<template lang="pug">
	div
		.titleName Имя кого бы то ни было
		.fastBtnGood
			.fastButtonBlock
				button.fastButton(@click="") Позвонить
				button.fastButton(@click="") Закончить
</template>

<script>
	export default {

	}
</script>

<style scoped>
	.fastBtnGood{
		position: fixed;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
		bottom: 25px;
	}
	.fastButtonBlock{
		padding: 7px;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		width: 95%;
		margin: 0 auto;
		max-width: 600px;
		text-align: center;
		display: flex;
	}
	.fastButton{
		display: block;
		outline: none;
		border: 2px solid #F64646;
		background: #F64646;
		color: white;
		border-radius: 3px;
		padding: 5px 10px;
		font-size: 16px;
		margin: 0 auto;
		width: 45%;
	}
	.titleName{
		text-align: center;
		width: 100%;
		font-size: 25px;
	}
</style>
