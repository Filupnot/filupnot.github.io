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
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/about","/games","/games/8-ball-pool","/games/darts-cricket","/games/dominoes","/games/oh-hell","/games/pass-the-pigs","/ren","/ren/glass-weight-calculator","/workout","/workout/push","/workout/pull","/workout/legs"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
