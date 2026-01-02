
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
		RouteId(): "/" | "/about" | "/games" | "/games/darts-cricket" | "/games/dominoes";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/about": Record<string, never>;
			"/games": Record<string, never>;
			"/games/darts-cricket": Record<string, never>;
			"/games/dominoes": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/games" | "/games/" | "/games/darts-cricket" | "/games/darts-cricket/" | "/games/dominoes" | "/games/dominoes/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/cricket-one.png" | "/cricket-three.png" | "/cricket-two.png" | "/darts-thumb.png" | "/darts-thumb.svg" | "/dominoes-thumb.svg" | "/favicon.svg" | "/philip-face.png" | string & {};
	}
}