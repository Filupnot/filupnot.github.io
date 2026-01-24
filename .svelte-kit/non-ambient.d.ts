
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/games" | "/games/8-ball-pool" | "/games/darts-cricket" | "/games/dominoes" | "/games/oh-hell" | "/games/pass-the-pigs";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/about": Record<string, never>;
			"/games": Record<string, never>;
			"/games/8-ball-pool": Record<string, never>;
			"/games/darts-cricket": Record<string, never>;
			"/games/dominoes": Record<string, never>;
			"/games/oh-hell": Record<string, never>;
			"/games/pass-the-pigs": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/games" | "/games/" | "/games/8-ball-pool" | "/games/8-ball-pool/" | "/games/darts-cricket" | "/games/darts-cricket/" | "/games/dominoes" | "/games/dominoes/" | "/games/oh-hell" | "/games/oh-hell/" | "/games/pass-the-pigs" | "/games/pass-the-pigs/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/cricket-one.png" | "/cricket-three.png" | "/cricket-two.png" | "/darts-thumb.png" | "/darts-thumb.svg" | "/dominoes-thumb.svg" | "/favicon.svg" | "/games/manifest.json" | "/icons/apple-touch-icon.png" | "/icons/icon-16.png" | "/icons/icon-192.png" | "/icons/icon-32.png" | "/icons/icon-512.png" | "/knot.png" | "/manifest.json" | "/oh-hell-thumb.svg" | "/philip-face.png" | "/pigs-thumb.svg" | "/pool-thumb.svg" | string & {};
	}
}