export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["connector.svg","favicon.png","feelings.js","hero/2phone.png","hero/2phone_lit.png","hero/bak/1phone.png","hero/bak/1phone_lit.png","hero/bak/2phone.png","hero/bak/2phone_lit.png","hero/bak/icon1.png","hero/bak/icon1_lit.png","hero/bak/icon2.png","hero/bak/icon2_lit.png","hero/bak/icon3.png","hero/bak/icon3_lit.png","hero/bak/icon4.png","hero/bak/icon4_lit.png","hero/icon1.png","hero/icon1_lit.png","hero/icon2.png","hero/icon2_lit.png","hero/icon3.png","hero/icon3_lit.png","hero/icon4.png","hero/icon4_lit.png","hero/phone_mobile.png","hero.bin","hero.gltf","holo3.jpg","Image_0.png","inverted-border.svg","iphone_mockup.png","needs.js","phone-icons-inverted.svg","phone-icons.svg","phone-lens.jpg","phone_frontal.png","screenshot-dashboard.png","screenshot-fight2.png","women.jpg"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".js":"text/javascript",".bin":"application/octet-stream",".gltf":"model/gltf+json",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.Di1txcoV.js","app":"_app/immutable/entry/app.C9ECgIsU.js","imports":["_app/immutable/entry/start.Di1txcoV.js","_app/immutable/chunks/entry.CXukiqCs.js","_app/immutable/chunks/scheduler.Clviz5E8.js","_app/immutable/entry/app.C9ECgIsU.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/scheduler.Clviz5E8.js","_app/immutable/chunks/index.C2t9fK9o.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/ai/checkForJudgement",
				pattern: /^\/api\/ai\/checkForJudgement\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/checkForJudgement/_server.ts.js'))
			},
			{
				id: "/api/mails/send",
				pattern: /^\/api\/mails\/send\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/mails/send/_server.ts.js'))
			},
			{
				id: "/api/populateFeelings",
				pattern: /^\/api\/populateFeelings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/populateFeelings/_server.ts.js'))
			},
			{
				id: "/api/populateNeeds",
				pattern: /^\/api\/populateNeeds\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/populateNeeds/_server.ts.js'))
			},
			{
				id: "/api/posthog/decide",
				pattern: /^\/api\/posthog\/decide\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/posthog/decide/_server.ts.js'))
			},
			{
				id: "/app/auth/login",
				pattern: /^\/app\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/app/auth/logout",
				pattern: /^\/app\/auth\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/app/auth/logout/_server.ts.js'))
			},
			{
				id: "/app/auth/register",
				pattern: /^\/app\/auth\/register\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/app/dashboard",
				pattern: /^\/app\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/app/fights",
				pattern: /^\/app\/fights\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/app/fights/create",
				pattern: /^\/app\/fights\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/app/fights/[id]",
				pattern: /^\/app\/fights\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/app/fights/[id]/respond",
				pattern: /^\/app\/fights\/([^/]+?)\/respond\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/app/selfempathy",
				pattern: /^\/app\/selfempathy\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
