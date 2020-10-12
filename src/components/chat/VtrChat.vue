<template lang="pug">
	div
		div(v-if="$route.name==='chat'")
			.header
				b-input.borderInput(v-model="search" placeholder="Поиск по сообщениям")
			.whiteBlock
				router-link.mainChatBlock(v-for="item in 10" to="chat/dialog/1" :key="item")
					.chatBlock
						.chatBlockImg
							img(src="https://i.ytimg.com/vi/JqyPgG1hagY/maxresdefault.jpg")
						.chatBlockInfo
							span Название объявления
							span Вы: Текст последнего сообщения
						span.chatDate  12.08.20
					.chatPrice
						span 600 000
					hr.chatBorder
		transition(name="opacity")
			router-view
</template>

<script>
	export default {
		data(){
			return{
				search:'',
			}
		}
	}
</script>

<style scoped>
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
		display: block;
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
