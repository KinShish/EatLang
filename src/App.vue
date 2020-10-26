<template lang="pug">
	div
		VtrAdditionalNotifications
		transition(name="opacity")
			router-view.mainContent
		VtrAdditionalBottomMenu(v-if="$store.state.user.data!=='-1'&&!($route.name==='pin'&&$route.name==='login')&&($route.name==='feed'||$route.name==='search'||$route.name==='add'||$route.name==='chat'||$route.name==='profile')")
</template>

<script>
	export default {
		components:{
			VtrAdditionalNotifications :()=>import('./components/additional/VtrAdditionalNotifications'),
			'VtrAdditionalBottomMenu':()=>import('./components/additional/VtrAdditionalBottomMenu'),
		},
		methods:{
			$_vtr_main_lazyLoad() {
				let scrollHeight = Math.max(
					document.body.scrollHeight, document.documentElement.scrollHeight,
					document.body.offsetHeight, document.documentElement.offsetHeight,
					document.body.clientHeight, document.documentElement.clientHeight
				);
				console.log()
				return (window.pageYOffset >= (scrollHeight - document.documentElement.clientHeight - 700));
			},
			$_vtr_main_scroll() {
				let oneScroll = 0;
				window.onscroll = () => {
					let twoScroll = window.pageYOffset;
					if (twoScroll > oneScroll && twoScroll > 100) {
						this.scr = true
					}
					if (twoScroll < oneScroll) {
						this.scr = false
					}
					oneScroll = twoScroll;
					this.$root.$emit('lazyLoad', this.$_vtr_main_lazyLoad());
				};
			},
			$vtr_main_loadCats:async function(){
				let data=await this.$store.getters.request('GET',this.$store.state.user.settings.server+'cat')
				if(data&&!data.err){
					this.$store.commit('loadCat',data.cats)
				}
			}
		},
		created() {
			if(localStorage.getItem('token')===null||localStorage.getItem('token')===''){
				this.$router.push('/login')
			}else{
				this.$store.commit('auth')
				this.$_vtr_main_scroll();
				this.$vtr_main_loadCats();
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
		max-width: 600px;
		margin: 0 auto;
	}
</style>
