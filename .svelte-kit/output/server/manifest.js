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
		client: {start:"_app/immutable/entry/start.CtZSw_w9.js",app:"_app/immutable/entry/app.01T0SV48.js",imports:["_app/immutable/entry/start.CtZSw_w9.js","_app/immutable/chunks/C78-m0cx.js","_app/immutable/chunks/BqAO4Gzu.js","_app/immutable/chunks/BRk2N3TX.js","_app/immutable/chunks/Ps2Ki1QF.js","_app/immutable/chunks/C_Yuzu4F.js","_app/immutable/entry/app.01T0SV48.js","_app/immutable/chunks/BqAO4Gzu.js","_app/immutable/chunks/CqEocA6X.js","_app/immutable/chunks/CeUXZaPU.js","_app/immutable/chunks/wAncXoqV.js","_app/immutable/chunks/C_Yuzu4F.js","_app/immutable/chunks/DxvVRONM.js","_app/immutable/chunks/xGk7dUjb.js","_app/immutable/chunks/BsR4yMnT.js","_app/immutable/chunks/D3v0BZuR.js","_app/immutable/chunks/BRk2N3TX.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/about","/games","/games/8-ball-pool","/games/darts-cricket","/games/dominoes","/games/oh-hell","/games/pass-the-pigs","/ren","/ren/glass-weight-calculator"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
