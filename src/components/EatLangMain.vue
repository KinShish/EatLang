<template lang="pug">
	div
		.mainComponent.backgroundMap
			.map
				img.imgMap(src="../assets/main.svg")
				.pathUser
					router-link(to="/question/1")
						img(src="../assets/building/church.svg")
					router-link(to="/question/2")
						img(src="../assets/building/halt.svg")
					router-link(to="/question/3")
						//img(src="../assets/building/halt.svg")
		transition(name="opacity")
			keep-alive
				router-view
</template>

<script>
	export default {

	}
</script>

<style scoped>
	.map{
		width: fit-content;
		height: 100%;
		position: absolute;
		margin: 0 auto;
		right: 0;
		left: 0;
		top: 0;
		bottom: 0;
	}
	.imgMap{
		min-height: 100%;
		width: auto;
		display: block;
		margin: 0 auto;
		border-radius: 5px;
		height: auto;
		border: 1px solid #8bb330;
	}
	.mainComponent{
		z-index: 1;
		position: absolute;
		width: 100%;
		height: 100%;
		display: grid;
		place-content: center;
		top: 0;
		bottom: 0;
	}
	.pathUser{
		width: auto;
		height: 100%;
		position: absolute;
		margin: 0 auto;
		right: 0;
		left: 0;
		top: 0;
		bottom: 0;
		max-width: 320px;
		min-height: 799px;
	}
	.pathUser a img{
		height: 100px;
		width: 100px;
	}
	.pathUser a:nth-child(1){
		bottom: 10px;
	}
	.pathUser a:nth-child(2){

		bottom: 48%;
	}
	.pathUser a:nth-child(3){
		right: 29%;
		top: 2%;
		height: 170px;
		width: 130px;
	}
	.pathUser a{
		display: block;
		width: -webkit-fit-content;
		width: -moz-fit-content;
		width: fit-content;
		position: absolute;
		background: rgb(255 255 255 / .6);
		border-radius: 50%;
	}
</style>
