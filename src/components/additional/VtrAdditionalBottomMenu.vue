<template lang="pug">
	.mainBlockMenu
		router-link(to="/feed")
			img(src="../../assets/menuImg/feed.svg")
			span Главная
		router-link(to="/search")
			img(src="../../assets/menuImg/search.svg")
			span Поиск
		router-link(to="/add")
			img(src="../../assets/menuImg/add.svg")
			span Добавить
		router-link(to="/chat")
			img(src="../../assets/menuImg/chat.svg")
			span Чат
		router-link(to="/profile")
			img(src="../../assets/menuImg/profile.svg")
			span Профиль
</template>

<script>
	export default {

	}
</script>

<style scoped>
	.mainBlockMenu{
		position: fixed;
		bottom: 0;
		width: 100%;
		background: white;
		height: 50px;
		padding-top: 7px;
		display: flex;
		box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.1)
	}
	.mainBlockMenu a{
		flex: 1;
		text-align: center;
		color: black;
		font-weight: normal;
		font-size: 13px;
	}
	.mainBlockMenu a:hover ,a:focus, a:active {
		text-decoration: none;
		color: black;
		outline: none;
	}
	.mainBlockMenu span{
		display: block;
	}
</style>
