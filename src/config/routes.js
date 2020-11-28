import VueRouter from "vue-router";
let routes = {
	path: '/',
	name:'index',
	component: () => import('../App'),
	children: [
		{
			path: 'info',
			component:()=> import('../components/EatLangInfo'),
			name: 'info',
		},
		{
			path: 'map/:type',
			component:()=> import('../components/EatLangMain'),
			name: 'game',
		},
		{
			path: 'question/:idQuestion',
			component:()=> import('../components/EatLangRoom'),
			name: 'question',
		}
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
