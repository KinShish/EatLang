<template lang="pug">
	div
		div(v-if="$route.name==='chat'")
			.header
				b-input.borderInput(v-model="search" placeholder="Поиск по сообщениям" @input="$_vtr_chat_search")
			.whiteBlock(v-if="rooms.length!==0")
				router-link.mainChatBlock(v-for="room in rooms" :to="'chat/dialog/'+room.key" :key="room.key")
					.chatBlock
						.chatBlockImg
							img(:src="$store.state.user.settings.server+'company/'+room.id_company+'/up/goods/'+room.img" v-if="room.img")
							img.noImg(src="../../assets/loadLogo.svg" v-else)
						.chatBlockInfo
							span {{room.name}}
							span Вы: Текст последнего сообщения
						span.chatDate  12.08.20
					.chatPrice
						span {{room.price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,'$1' + ' ')+' ₽'}}
					hr.chatBorder
			.noRooms(v-else) Диалогов еще нет :(
		transition(name="opacity")
			router-view
</template>

<script>
	export default {
		data(){
			return{
				search:'',
				rooms:[]
			}
		},
		methods:{
			$_vtr_chat_search(){
				if(this.search.length>1){
					this.rooms=this.rooms.filter(room=>room.name.toLowerCase().substr(0,this.search.length)===this.search.toLowerCase())
				}else{
					this.rooms=this.$store.state.user.rooms
				}
			}
		},
		watch:{
			'$store.state.user.rooms'(){
				this.rooms=this.$store.state.user.rooms
			}
		},
		activated() {
			this.rooms=this.$store.state.user.rooms
		}
	}
</script>

<style scoped>
	.noRooms{
		text-align: center;
		font-size: 30px;
		color: #f54646;
		height: 100%;
		position: absolute;
		bottom: 0;
		width: 100%;
		display: grid;
		place-content: center;
		padding-bottom: 60px;
	}
	.noImg{
		height: 30px !important;
	}
	.chatBorder{
		border: 1px dashed #757575;
	}
	.header{
		padding: 5px;
	}
	.header input {
		width: 95%;
		margin: 5px auto;
		border: 1px solid #333333;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
	}
	.mainChatBlock{
		margin: 13px 15px 0 15px;
		display: block;
		color: black;
		text-decoration: none;
	}
	.chatBlock{
		display: flex;
	}
	.chatBlockInfo{
		font-size: 12px;
		margin-left: 10px;
		white-space: nowrap;
		overflow: hidden;
		padding-right: 5px;
		display: block;
		flex: auto;
	}
	.chatBlockInfo span{
		display: block;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.chatBlockInfo span:nth-child(2){
		color: #757575;
	}
	.chatDate{
		font-size: 12px;
		color: #757575;
		margin-left: 10px;;
	}
	.chatBlockImg{
		width: 50px;
		height: 40px;
		display: grid;
		place-content: center;
		background: #DEDEDE;
		line-height: 40px;
		min-width: 50px;
		overflow: hidden;
		border-radius: 3px;
	}
	.chatBlockImg img{
		width: auto;
		height: 40px;
		display: block;
		margin: 0 auto;
	}
	.chatPrice{
		padding-bottom: 10px;
	}
	.chatPrice span{
		font-size: 14px;
		display: inline-block;
		float: right;
		color: #26C281;
	}
</style>
