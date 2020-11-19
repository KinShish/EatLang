<template lang="pug">
	.mainBlockMenu(:class="$root.platform==='iPhone'?'iphonePadding':''")
		router-link(to="/feed")
			div(@click="$_vtr_menu_aimationMenuIcon('menuFeed')")
				img(:src="$route.name==='feed'?images.feedActive:images.feed" ref="menuFeed")
				span(:class="$route.name==='feed'?'redColor':''") Главная
		router-link(to="/search")
			div(@click="$_vtr_menu_aimationMenuIcon('menuSearch')")
				img(:src="$route.name==='search'?images.searchActive:images.search" ref="menuSearch")
				span(:class="$route.name==='search'?'redColor':''") Поиск
		router-link(to="/add")
			div(@click="$_vtr_menu_aimationMenuIcon('menuAdd')")
				img(:src="$route.name==='add'?images.addActive:images.add" ref="menuAdd")
				span(:class="$route.name==='add'?'redColor':''") Добавить
		router-link(to="/chat")
			div(@click="$_vtr_menu_aimationMenuIcon('menuChat')")
				img(:src="$route.name==='chat'?images.chatActive:images.chat" ref="menuChat")
				span(:class="$route.name==='chat'?'redColor':''") Чат
				span.notifMessage(v-if="notification") {{notification}}
		router-link(to="/profile")
			div(@click="$_vtr_menu_aimationMenuIcon('menuProfile')")
				img(:src="$route.name==='profile'?images.profileActive:images.profile" ref="menuProfile")
				span(:class="$route.name==='profile'?'redColor':''") Профиль
</template>

<script>
	import feed from '../../assets/menuImg/feed.svg'
	import feedActive from '../../assets/menuImg/feedActive.svg'
	import search from '../../assets/menuImg/search.svg'
	import searchActive from '../../assets/menuImg/searchActive.svg'
	import add from '../../assets/menuImg/add.svg'
	import addActive from '../../assets/menuImg/addActive.svg'
	import chat from '../../assets/menuImg/chat.svg'
	import chatActive from '../../assets/menuImg/chatActive.svg'
	import profile from '../../assets/menuImg/profile.svg'
	import profileActive from '../../assets/menuImg/profileActive.svg'
	export default {
		data(){
			return{
				notification:0,
				images:{
					feed: feed,
					feedActive:feedActive,
					search:search,
					searchActive:searchActive,
					add:add,
					addActive:addActive,
					chat:chat,
					chatActive:chatActive,
					profile:profile,
					profileActive:profileActive
				}
			}
		},
		methods:{
			$_vtr_menu_aimationMenuIcon(e){
				this.$refs[e].classList.add('sizeImgBtn');
				setTimeout(()=> {this.$refs[e].classList.remove('sizeImgBtn')}, 700);
			}
		},
		mounted(){
			this.notification=this.$store.getters.watchChatMessage('all')
		},
		watch:{
			'$store.state.user.newMessage.hash'(){
				this.notification=this.$store.getters.watchChatMessage('all')
			},

		},
		async created(){
        }
	}
</script>

<style scoped>
	.notifMessage{
		background: #F64646;
		color: white;
		position: absolute;
		right: -16px;
		top: 0;
		min-width: 16px;
		height: 16px;
		border-radius: 50%;
		font-size: 10px;
		line-height: 16px;
	}
	.redColor{
		color: red;
		transition: .3s ease;
	}
	.sizeImgBtn{
		animation: sizeimg .8s;
	}
	@keyframes sizeimg {
		0% {
			transform: scale(.7);

		}
		50% {
			transform: scale(1.2);

		}

		100% {
			transform: scale(1);

		}
	}
	.iphonePadding{
		padding-bottom: 10px;
		height: 70px !important;
	}
	.mainBlockMenu{
		position: fixed;
		bottom: 0;
		width: 100%;
		background: white;
		height: 60px;
		display: flex;
		box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		padding-top: 10px;
	}
	.mainBlockMenu a{
		flex: 1;
		text-align: center;
		color: black;
		font-weight: normal;
		font-size: 13px;
	}
	.mainBlockMenu a:hover ,a:focus, a:active {
		text-decoration: none;
		color: black;
		outline: none;
	}
	.mainBlockMenu a div{
		position: relative;
		width: fit-content;
		margin: 0 auto;
		text-align: center;
	}
	.mainBlockMenu span{
		display: block;
	}
</style>
