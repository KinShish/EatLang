<template lang="pug">
	.mainBlockGood
		.blockImg
			img(src="https://alna.ru/up/services_img/1427/03058d059257409dfe70e596ad320c9726e2ec93.jpg")
		.contentGood
			.statGoodsBlock
				img(src="../../assets/goodsImg/eye.svg")
				span 320
				span    +21
			.statGoodsBlock
				img(src="../../assets/goodsImg/heart.svg")
				span 320
			.nameGood
				span Японский мини трактор HINOMOTO N249D
			.descriptionGood
				p {{string.substr(0,100)}}
					span ... Подробнее
			.priceBlock
				span {{price.toString().replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g,'$1' + ' ')+' ₽'}}
				span 20.09.2020 15:19
</template>

<script>
	export default {
		data(){
			return{
				price:'600000',
				string:'это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.'
			}
		},
	}
</script>

<style scoped>
	.mainBlockGood{
		margin-bottom: 15px;
	}
	.blockImg{
		width: 100%;
		height: 200px;
		background: #DEDEDE;
	}
	.blockImg img{
		height: 100%;
		display: block;
		margin: 0 auto;
	}
	.contentGood{
		margin: 2px 15px;
	}
	.statGoodsBlock{
		display: inline-block;
		margin-right: 15px;
	}
	.statGoodsBlock span:nth-child(3){
		color: #3cc281;
	}
	.statGoodsBlock img{
		margin-right: 5px;
	}
	.nameGood{
		font-size: 16px;
	}
	.descriptionGood p{
		color: #757575;
		margin-bottom: 5px;
	}
	.descriptionGood span{
		color: #F64646;
	}
	.priceBlock{
		font-size: 16px;
	}
	.priceBlock span:nth-child(1){
		color: #26c281;
	}
	.priceBlock span:nth-child(2){
		color: #757575;
		float: right;
	}
</style>
