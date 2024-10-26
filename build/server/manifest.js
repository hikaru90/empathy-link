const manifest = (() => {
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
		client: {"start":"_app/immutable/entry/start.qRIh-Fmp.js","app":"_app/immutable/entry/app.BEZwKGRT.js","imports":["_app/immutable/entry/start.qRIh-Fmp.js","_app/immutable/chunks/entry.B5Mv6Uxa.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/entry/app.BEZwKGRT.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/scheduler.BGpOBVyA.js","_app/immutable/chunks/index.wJhSdTM5.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-DKRNPPqf.js')),
			__memo(() => import('./chunks/1-CKxV8zuw.js')),
			__memo(() => import('./chunks/2-YB2R_fG1.js')),
			__memo(() => import('./chunks/3-CXx-F4kI.js')),
			__memo(() => import('./chunks/4-PyNPt4Ta.js')),
			__memo(() => import('./chunks/5-D9eMt2zB.js')),
			__memo(() => import('./chunks/6-CS_l5Gz8.js')),
			__memo(() => import('./chunks/7-WAlnj4m3.js')),
			__memo(() => import('./chunks/8-DNZpcodi.js')),
			__memo(() => import('./chunks/9-B__7CYsG.js')),
			__memo(() => import('./chunks/10-CJXqyDqY.js')),
			__memo(() => import('./chunks/11-lc6G7bwB.js'))
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
				endpoint: __memo(() => import('./chunks/_server.ts-DcPWlbFk.js'))
			},
			{
				id: "/api/mails/send",
				pattern: /^\/api\/mails\/send\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-eVQvx8Gh.js'))
			},
			{
				id: "/api/populateFeelings",
				pattern: /^\/api\/populateFeelings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BSwIKbLq.js'))
			},
			{
				id: "/api/populateNeeds",
				pattern: /^\/api\/populateNeeds\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B9PV7XQ7.js'))
			},
			{
				id: "/api/posthog/decide",
				pattern: /^\/api\/posthog\/decide\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Di6hoRF8.js'))
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
				endpoint: __memo(() => import('./chunks/_server.ts-BZEUQxEF.js'))
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

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
