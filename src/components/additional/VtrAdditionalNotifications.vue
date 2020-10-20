<template lang="pug" f>
	transition-group(name="notif" tag="span")
		div.notification(v-if="$store.state.user.notification!==''" :key="1")
			span {{$store.state.user.notification}}
</template>

<script>
</script>

<style scoped>
	.notif-enter-active, .notif-leave-active {
		transition: all .3s;
	}
	.notif-enter, .notif-leave-to {
		opacity: 0;
		transform: translateY(-100%);
	}
	.notification{
		position: absolute;
		width: 100%;
		min-height: 30px;
		background: #f54646;
		z-index: 1000;
		text-align: center;
		color: white;
		line-height: 30px;
		font-weight: bolder;
	}
</style>
