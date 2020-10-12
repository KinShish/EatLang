<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Избранное
		.greyBlock(v-if="$route.name==='favorites'")
			VtrAdditionalProduct(v-for="item in 10" :key="item" :hrefLink="'favorites/good/'+item")
		transition(name="opacity")
			router-view
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
