const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["connector.svg","favicon.png","feelings.js","hero/2phone.png","hero/2phone_lit.png","hero/bak/1phone.png","hero/bak/1phone_lit.png","hero/bak/2phone.png","hero/bak/2phone_lit.png","hero/bak/icon1.png","hero/bak/icon1_lit.png","hero/bak/icon2.png","hero/bak/icon2_lit.png","hero/bak/icon3.png","hero/bak/icon3_lit.png","hero/bak/icon4.png","hero/bak/icon4_lit.png","hero/icon1.png","hero/icon1_lit.png","hero/icon2.png","hero/icon2_lit.png","hero/icon3.png","hero/icon3_lit.png","hero/icon4.png","hero/icon4_lit.png","hero/phone_mobile.png","hero.bin","hero.gltf","holo3.jpg","Image_0.png","inverted-border.svg","needs.js","phone-icons-inverted.svg","phone-icons.svg","phone-lens.jpg","phone_frontal.png","screenshot-dashboard.png","screenshot-fight2.png"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".js":"text/javascript",".bin":"application/octet-stream",".gltf":"model/gltf+json",".jpg":"image/jpeg"},
	_: {
		client: {"start":"_app/immutable/entry/start.B2mh1wZW.js","app":"_app/immutable/entry/app.OWHkh9s9.js","imports":["_app/immutable/entry/start.B2mh1wZW.js","_app/immutable/chunks/entry.CEh8OOCl.js","_app/immutable/chunks/scheduler.gWKEXFbz.js","_app/immutable/entry/app.OWHkh9s9.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/scheduler.gWKEXFbz.js","_app/immutable/chunks/index.CG0cexN_.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-D19cyZvb.js')),
			__memo(() => import('./chunks/1-BZupqEI2.js')),
			__memo(() => import('./chunks/2-gtv147Bc.js')),
			__memo(() => import('./chunks/3-BaGPzpmS.js')),
			__memo(() => import('./chunks/4-C58HXnl1.js')),
			__memo(() => import('./chunks/5-DZTbJ6xT.js')),
			__memo(() => import('./chunks/6-Dbluu3le.js')),
			__memo(() => import('./chunks/7-GOuSnG5F.js')),
			__memo(() => import('./chunks/8-DXCsFgwL.js')),
			__memo(() => import('./chunks/9-CvEg4Fc3.js')),
			__memo(() => import('./chunks/10-sV01_u26.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/mails/send",
				pattern: /^\/api\/mails\/send\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BA_l0vC5.js'))
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
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/auth/logout",
				pattern: /^\/auth\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CsJOcJ5V.js'))
			},
			{
				id: "/auth/register",
				pattern: /^\/auth\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/fights",
				pattern: /^\/fights\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/fights/create",
				pattern: /^\/fights\/create\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/fights/[id]",
				pattern: /^\/fights\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/fights/[id]/respond",
				pattern: /^\/fights\/([^/]+?)\/respond\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/selfempathy",
				pattern: /^\/selfempathy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
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
