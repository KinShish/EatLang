<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Избранное
		VtrAdditionalProduct(v-for="item in 10" :key="item")
</template>

<script>
	export default {
		data(){
			return{

			}
		},
		components:{
			'VtrAdditionalProduct':()=>import('../additional/VtrAdditionalProduct'),
		}
	}
</script>

<style scoped>

</style>
