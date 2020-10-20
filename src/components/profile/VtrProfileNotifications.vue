<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Последнии изменения
		.mainBlock
			| {{notifications}}
</template>

<script>
	export default {
		data(){
			return{
				notifications:[],
			}
		},
		methods:{
			vtr_load_notifications:async function(){
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'user/push');
				if(!data.err){
					console.log(data.push)
					this.notifications=data.push;
				}else{
					this.$store.commit('notification','Произошла ошибка')
				}
			}
		},
		created() {
			this.vtr_load_notifications();
		}
	}
</script>

<style scoped>
	.mainBlock {
		margin: 13px 30px 0 30px;
	}
</style>
