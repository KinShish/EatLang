<template lang="pug">
	//div
		router-view.mainContent(v-if="$route.name==='pin'||$route.name==='login'")
		VtrAdditionalBottomMenu(v-else-if="$store.state.user.data!=='-1'")
	div
		router-view.mainContent
		VtrAdditionalBottomMenu(v-if="$store.state.user.data!=='-1'&&$route.name!=='pin'&&$route.name!=='login'")

</template>

<script>
	export default {
		components:{
			'VtrAdditionalBottomMenu':()=>import('./components/additional/VtrAdditionalBottomMenu'),
		},
		created() {
			if(localStorage.getItem('token')===null||localStorage.getItem('token')===''){
				this.$router.push('/login')
			}else{
				this.$store.commit('auth')
			}
		},
		watch:{
			'$store.state.user.data'(){
				if(this.$store.state.user.data!=='-1'){
					this.$router.push('/pin')
				}else{
					this.$router.push('/login')
				}
			},
			'$store.state.user.errAuth'(){
				if(this.$store.state.user.errAuth){
					this.$router.push('/login')
				}
			}
		},

	}
</script>

<style scoped>
	.mainContent{
		padding-bottom: 50px;
	}
</style>
