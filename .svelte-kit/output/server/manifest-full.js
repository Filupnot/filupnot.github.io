export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","cricket-one.png","cricket-three.png","cricket-two.png","darts-thumb.png","darts-thumb.svg","dominoes-thumb.svg","favicon.svg","games/manifest.json","icons/apple-touch-icon.png","icons/icon-16.png","icons/icon-192.png","icons/icon-32.png","icons/icon-512.png","knot.png","manifest.json","oh-hell-thumb.svg","philip-face.png","pigs-thumb.svg","pool-thumb.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.D8uuiYG7.js",app:"_app/immutable/entry/app.BmyGKHEY.js",imports:["_app/immutable/entry/start.D8uuiYG7.js","_app/immutable/chunks/CRZ7XNtN.js","_app/immutable/chunks/OkgDLo3s.js","_app/immutable/chunks/j7JlpyFE.js","_app/immutable/chunks/CirKMD74.js","_app/immutable/chunks/Dmz1izpj.js","_app/immutable/entry/app.BmyGKHEY.js","_app/immutable/chunks/OkgDLo3s.js","_app/immutable/chunks/BR2KVbEA.js","_app/immutable/chunks/D6IYFWxt.js","_app/immutable/chunks/7E3TE2H7.js","_app/immutable/chunks/Dmz1izpj.js","_app/immutable/chunks/Fk3cocL4.js","_app/immutable/chunks/B84cQ8CF.js","_app/immutable/chunks/Ckq8cjvW.js","_app/immutable/chunks/DB8Rhpuk.js","_app/immutable/chunks/j7JlpyFE.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
			__memo(() => import('./nodes/9.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/games",
				pattern: /^\/games\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/games/8-ball-pool",
				pattern: /^\/games\/8-ball-pool\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/games/darts-cricket",
				pattern: /^\/games\/darts-cricket\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/games/dominoes",
				pattern: /^\/games\/dominoes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/games/oh-hell",
				pattern: /^\/games\/oh-hell\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/games/pass-the-pigs",
				pattern: /^\/games\/pass-the-pigs\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
