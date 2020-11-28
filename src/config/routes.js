import VueRouter from "vue-router";
let routes = {
	path: '/',
	name:'index',
	component: () => import('../App'),
	children: [
		{
			path: 'gameMode',
			component:()=> import('../components/EatLangGameMode'),
			name: 'gameMode',
		},
		//Ситуативная игра начало
		{
			path: 'info/1',
			component:()=> import('../components/situational/EatLangSituationalInfo'),
			name: 'info',
		},
		{
			path: 'map/1',
			component:()=> import('../components/situational/EatLangSituationalMain'),
			name: 'map',
		},
		{
			path: 'room/1',
			component:()=> import('../components/situational/EatLangSituationalRoom'),
			name: 'room',
		},
		{
			path: 'sound/1',
			component:()=> import('../components/situational/EatLangSituationalSound'),
			name: 'sound',
		},
		//Ситуативная игра конец
		//Small Talk начало
		{
			path: 'info/2',
			component:()=> import('../components/smallTalk/EatLangSmallTalkInfo'),
			name: 'info',
		},
		{
			path: 'room/2',
			component:()=> import('../components/smallTalk/EatLangSmallTalkRoom'),
			name: 'room',
		},
		{
			path: 'sound/2',
			component:()=> import('../components/smallTalk/EatSmallTalkLangSound'),
			name: 'sound',
		},
		//Small Talk конец
	]
}
export const router = new VueRouter({
	scrollBehavior(to, from, savedPosition) {
		if(savedPosition){
			return savedPosition
		}
		else{
			return {x: 0, y: 0}
		}
	},
	routes: [routes]
});
router.beforeEach((to, from, next) => {
	if(from.query.redact){
		router.app.$root.$emit('routeTo',{name:from.name,to:to.fullPath});
		next(false);
	}
	else {next()}
});
