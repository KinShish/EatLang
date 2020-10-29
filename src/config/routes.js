import VueRouter from "vue-router";
let routes = {
	path: '/',
	name:'index',
	component: () => import('../App'),
	children: [
		{
			path: 'call',
			component: () => import('../components/additional/VtrAdditionalCallUser'),
			name: 'call',
		},
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
			component: () => import('../components/search/VtrSearch'),
			name: 'search',
			children: [
				{
					path: 'searchPageCat/:idCat',
					component: () => import('../components/search/VtrSearchPageCat'),
					name: 'searchPageCat',
				},
			]
		},
		{
			path: 'add',
			component: () => import('../components/VtrAdd'),
			name: 'add',
		},
		{
			path: 'edit/:idGood',
			component: () => import('../components/VtrAdd'),
			name: 'edit',
		},
		{
			path: 'chat',
			component: () => import('../components/chat/VtrChat'),
			name: 'chat',
			children:[
				{
					path: 'dialog/:id',
					component: () => import('../components/chat/VtrChatDialog'),
					name: 'dialog',
				}
			]
		},
		{
			path: 'profile',
			component: () => import('../components/profile/VtrProfile'),
			name: 'profile',
			children:[
				{
					path: 'managers',
					component: () => import('../components/profile/VtrProfileManagersCompany'),
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
						{
							path: 'manager/:id',
							component: () => import('../components/profile/VtrProfileManager'),
							name: 'manager',
							children:[
								{
									path: 'notification/:managerId',
									component: () => import('../components/profile/VtrProfileManagerNotifications'),
									name: 'notificationManager',
								},
								{
									path: 'favorites/:managerId',
									component: () => import('../components/profile/VtrProfileManagerFavorites'),
									name: 'favoritesManager',
								},
							]
						},
					]
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
		},
		{
			path: 'good/:idGood',
			component: () => import('../components/additional/VtrAdditionalGoodIndex'),
			name: 'good',
		},
		{
			path: 'company/:idComp',
			component: () => import('../components/profile/VtrProfileCompany'),
			name: 'company',
		},
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
