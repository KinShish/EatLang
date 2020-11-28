<template lang="pug">
	div
		.mainComponent.backgroundMap
			.map
				img.imgMap(src="../assets/main.svg")
				.pathUser
					a
						img.dontWork(src="../assets/dontWork.svg")
						img(src="../assets/building/churchGrey.svg")
					a
						img.dontWork(src="../assets/dontWork.svg")
						img(src="../assets/building/haltGrey.svg")
					router-link(to="/question/1")
						img.point(src="../assets/point.svg")
						img(src="../assets/building/hotel.svg")
		transition(name="opacity")
			keep-alive
				router-view
</template>

<script>
	export default {
		activated() {
			console.log(this.$route.params.type)
		}
	}
</script>

<style scoped>
	.dontWork{
		position: absolute;
		bottom: 50%;
		left: 30%;
	}
	.point{
		position: absolute;
		height: 30px !important;
		width: 30px !important;
		right: 35%;
	}
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
		top: 6%;
		height: 170px;
		width: 130px;
	}
	.pathUser a{
		display: grid;
		width: -webkit-fit-content;
		width: -moz-fit-content;
		width: fit-content;
		position: absolute;
		place-content: center;
	}
</style>
