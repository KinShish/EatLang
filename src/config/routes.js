import VueRouter from "vue-router";
let routes = {
	path: '/',
	name:'index',
	component: () => import('../App'),
	children: [
		{
			path: 'login',
			component: () => import('../components/authorization/VtrAuthorizationLogin'),
			name: 'login',
		},
		{
			path: 'pin',
			component: () => import('../components/authorization/VtrAuthorizationPin'),
			name: 'pin',
		},
		{
			path: 'feed',
			component: () => import('../components/VtrFeed'),
			name: 'feed',
		},
		{
			path: 'search',
			component: () => import('../components/VtrSearch'),
			name: 'search',
		},
		{
			path: 'add',
			component: () => import('../components/VtrAdd'),
			name: 'add',
		},
		{
			path: 'chat',
			component: () => import('../components/VtrChat'),
			name: 'chat',
		},
		{
			path: 'profile',
			component: () => import('../components/profile/VtrProfile'),
			name: 'profile',
			children:[
				{
					path: 'managers',
					component: () => import('../components/profile/VtrProfileManagers'),
					name: 'managers',
					children:[
						{
							path: 'add',
							component: () => import('../components/profile/VtrProfileEditManager'),
							name: 'addManager',
						},
						{
							path: 'edit/:id',
							component: () => import('../components/profile/VtrProfileEditManager'),
							name: 'editManager',
						},
					]
				},
				{
					path: 'companyGoods',
					component: () => import('../components/profile/VtrProfileCompanyGoods'),
					name: 'companyGoods',
				},
				{
					path: 'favorites',
					component: () => import('../components/profile/VtrProfileFavorites'),
					name: 'favorites',
				},
				{
					path: 'notifications',
					component: () => import('../components/profile/VtrProfileNotifications'),
					name: 'notifications',
				},
				{
					path: 'settings',
					component: () => import('../components/profile/VtrProfileSettings'),
					name: 'settings',
				},
			]
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
