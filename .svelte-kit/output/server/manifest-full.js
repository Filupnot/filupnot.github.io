export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["cricket-one.png","cricket-three.png","cricket-two.png","darts-thumb.png","darts-thumb.svg","dominoes-thumb.svg","favicon.svg","games/manifest.json","icons/apple-touch-icon.png","icons/icon-16.png","icons/icon-192.png","icons/icon-32.png","icons/icon-512.png","knot.png","manifest.json","oh-hell-thumb.svg","philip-face.png","pigs-thumb.svg","pool-thumb.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.DJEIce__.js",app:"_app/immutable/entry/app.D7ly30gx.js",imports:["_app/immutable/entry/start.DJEIce__.js","_app/immutable/chunks/0d2C45fy.js","_app/immutable/chunks/BcBnY1C5.js","_app/immutable/chunks/BUYRcq9n.js","_app/immutable/chunks/BMwymINt.js","_app/immutable/chunks/C-Dw83L1.js","_app/immutable/entry/app.D7ly30gx.js","_app/immutable/chunks/BcBnY1C5.js","_app/immutable/chunks/DYBo2Op1.js","_app/immutable/chunks/q6mOKqdP.js","_app/immutable/chunks/B_yitYQZ.js","_app/immutable/chunks/C-Dw83L1.js","_app/immutable/chunks/DKsBXdNh.js","_app/immutable/chunks/CjjSEJ9C.js","_app/immutable/chunks/D1ueVY8H.js","_app/immutable/chunks/Bg24mj2a.js","_app/immutable/chunks/BQABW9Mc.js","_app/immutable/chunks/BUYRcq9n.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
			__memo(() => import('./nodes/14.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/games",
				pattern: /^\/games\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/games/8-ball-pool",
				pattern: /^\/games\/8-ball-pool\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/games/darts-cricket",
				pattern: /^\/games\/darts-cricket\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/games/dominoes",
				pattern: /^\/games\/dominoes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/games/oh-hell",
				pattern: /^\/games\/oh-hell\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/games/pass-the-pigs",
				pattern: /^\/games\/pass-the-pigs\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/ren",
				pattern: /^\/ren\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/ren/glass-weight-calculator",
				pattern: /^\/ren\/glass-weight-calculator\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/workout",
				pattern: /^\/workout\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/workout/[type]",
				pattern: /^\/workout\/([^/]+?)\/?$/,
				params: [{"name":"type","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
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
