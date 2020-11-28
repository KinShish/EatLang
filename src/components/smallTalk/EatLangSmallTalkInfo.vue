<template lang="pug">
	div
		img.titleImage(src="../../assets/story/room2.svg")
		.title ДОБРАТЬСЯ ДО ДОСТОПРИМЕЧАТЕЛЬНОСТИ
		p.decript Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nunc sed eu, pellentesque vitae purus. Auctor nunc, id bibendum et etiam. Eget purus nisi, at in mauris cras condimentum. Non sed pharetra vel aenean mauris ut arcu praesent. Eu diam mi cursus dolor, non. Arcu vitae augue arcu varius phasellus interdum vel. At tincidunt risus adipiscing et mi viverra. Elit ut egestas ipsum eu enim urna faucibus donec.
		.goToGameBlock
			button.goToGame(@click="$router.push('/sound/2')") Продолжить
</template>

<script>
</script>

<style scoped>
	.decript{
		width: 80%;
		margin: 0 auto;
		max-width: 600px;
		color: #757575;
	}
	.titleImage{
		width: 100%;
		max-height: 300px;
	}
	.title{
		color: #15CC5E;
		font-size: 18px;
		text-align: center;
		margin-top: 15px;
	}
</style>
