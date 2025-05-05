export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["bullshift/bullshift-logo.svg","connector.svg","favicon.png","feelings.js","hero/2phone.png","hero/2phone_lit.png","hero/bak/1phone.png","hero/bak/1phone_lit.png","hero/bak/2phone.png","hero/bak/2phone_lit.png","hero/bak/icon1.png","hero/bak/icon1_lit.png","hero/bak/icon2.png","hero/bak/icon2_lit.png","hero/bak/icon3.png","hero/bak/icon3_lit.png","hero/bak/icon4.png","hero/bak/icon4_lit.png","hero/icon1.png","hero/icon1_lit.png","hero/icon2.png","hero/icon2_lit.png","hero/icon3.png","hero/icon3_lit.png","hero/icon4.png","hero/icon4_lit.png","hero/phone_mobile.png","hero.bin","hero.gltf","holo3.jpg","Image_0.png","inverted-border-white.svg","inverted-border.svg","iphone_mockup.png","needs.js","phone-icons-inverted.svg","phone-icons.svg","phone-lens.jpg","phone_frontal.png","screenshot-dashboard.png","screenshot-fight2.png","shapes/shape1.svg","shapes/shape10.svg","shapes/shape11.svg","shapes/shape12.svg","shapes/shape2.svg","shapes/shape3.svg","shapes/shape4.svg","shapes/shape5.svg","shapes/shape6.svg","shapes/shape7.svg","shapes/shape8.svg","shapes/shape9.svg","women.jpg"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".js":"text/javascript",".bin":"application/octet-stream",".gltf":"model/gltf+json",".jpg":"image/jpeg"},
	_: {
		client: null,
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
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js'))
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
				id: "/api/ai/bullshift/analyzeChat",
				pattern: /^\/api\/ai\/bullshift\/analyzeChat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/bullshift/analyzeChat/_server.ts.js'))
			},
			{
				id: "/api/ai/bullshift/cleanup",
				pattern: /^\/api\/ai\/bullshift\/cleanup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/bullshift/cleanup/_server.ts.js'))
			},
			{
				id: "/api/ai/bullshift/clearChat",
				pattern: /^\/api\/ai\/bullshift\/clearChat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/bullshift/clearChat/_server.ts.js'))
			},
			{
				id: "/api/ai/bullshift/extractMemories",
				pattern: /^\/api\/ai\/bullshift\/extractMemories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/bullshift/extractMemories/_server.ts.js'))
			},
			{
				id: "/api/ai/bullshift/flushMemory",
				pattern: /^\/api\/ai\/bullshift\/flushMemory\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/bullshift/flushMemory/_server.ts.js'))
			},
			{
				id: "/api/ai/bullshift/initChat",
				pattern: /^\/api\/ai\/bullshift\/initChat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/bullshift/initChat/_server.ts.js'))
			},
			{
				id: "/api/ai/bullshift/send",
				pattern: /^\/api\/ai\/bullshift\/send\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/bullshift/send/_server.ts.js'))
			},
			{
				id: "/api/ai/checkForJudgement",
				pattern: /^\/api\/ai\/checkForJudgement\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/checkForJudgement/_server.ts.js'))
			},
			{
				id: "/api/ai/selfempathy/initChat",
				pattern: /^\/api\/ai\/selfempathy\/initChat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/selfempathy/initChat/_server.ts.js'))
			},
			{
				id: "/api/ai/selfempathy/sendMessage",
				pattern: /^\/api\/ai\/selfempathy\/sendMessage\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/selfempathy/sendMessage/_server.ts.js'))
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
			},
			{
				id: "/app/selfempathy/create",
				pattern: /^\/app\/selfempathy\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/app/selfempathy/[id]",
				pattern: /^\/app\/selfempathy\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/app/selfempathy/[id]/respond",
				pattern: /^\/app\/selfempathy\/([^/]+?)\/respond\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/bullshift",
				pattern: /^\/bullshift\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/bullshift/insights",
				pattern: /^\/bullshift\/insights\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/bullshift/insights/[id]",
				pattern: /^\/bullshift\/insights\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/bullshift/memory",
				pattern: /^\/bullshift\/memory\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/bullshift/stats",
				pattern: /^\/bullshift\/stats\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/utility/shapes2",
				pattern: /^\/utility\/shapes2\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/utility/shapes",
				pattern: /^\/utility\/shapes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
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
