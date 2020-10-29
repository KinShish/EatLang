<template lang="pug">
	div
		.header
			img.back(src="../../assets/back.svg" @click="$router.go(-1)")
			span Последние изменения
		.mainBlock
			div(v-for="item in notifications" :class="item.type")
				span {{item.description}}
				span    {{item.date}}
				br
</template>

<script>
	export default {
		data(){
			return{
				notifications:[],
			}
		},
		methods:{
			async vtr_load_notifications(){
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'user/push/'+this.$route.params.managerId);
				if(!data.err){
					this.notifications=data.push;
					console.log(this.notifications)
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
	.auth{
		color: #757575;
	}
	.goods{
		color: #26C281;
	}
	.subscription{
		color: #F64646;
	}
	.mainBlock {
		margin: 13px 15px 0 15px;
		font-size: 14px;
	}
</style>
