import VueRouter from "vue-router";
let routes = {
	path: '/',
	name:'index',
	component: () => import('../App'),
	children: [
		//Ситуативная игра начало
		{
			path: 'info/1',
			component:()=> import('../components/situational/EatLangSituationalInfo'),
			name: 'info',
		},
		{
			path: 'map/1',
			component:()=> import('../components/situational/EatLangSituationalMain'),
			name: 'game',
		},
		{
			path: 'room/1',
			component:()=> import('../components/situational/EatLangSituationalRoom'),
			name: 'question',
		},
		{
			path: 'sound/1',
			component:()=> import('../components/situational/EatLangSituationalSound'),
			name: 'info',
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
			name: 'question',
		},
		{
			path: 'sound/2',
			component:()=> import('../components/smallTalk/EatSmallTalkLangSound'),
			name: 'info',
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
