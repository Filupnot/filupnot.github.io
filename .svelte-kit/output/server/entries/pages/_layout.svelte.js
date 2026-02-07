import { U as store_get, V as head, W as attr_class, X as attr, Y as slot, Z as unsubscribe_stores, _ as stringify } from "../../chunks/index2.js";
import { b as base } from "../../chunks/server.js";
import "@sveltejs/kit/internal/server";
import { g as getContext } from "../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "../../chunks/state.svelte.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let pageKey;
    let theme = "light";
    const isGamesPath = (pathname) => {
      return pathname === "/games" || pathname.startsWith("/games/") || pathname === `${base}/games` || pathname.startsWith(`${base}/games/`);
    };
    const isGamesIndexPath = (pathname) => {
      return pathname === "/games" || pathname === `${base}/games`;
    };
    const isGamesSubpath = (pathname) => {
      return isGamesPath(pathname) && !isGamesIndexPath(pathname);
    };
    const isHomePath = (pathname) => {
      return pathname === "/" || pathname === base || pathname === `${base}/`;
    };
    const isRenPath = (pathname) => {
      return pathname === "/ren" || pathname.startsWith("/ren/") || pathname === `${base}/ren` || pathname.startsWith(`${base}/ren/`);
    };
    const isRenIndexPath = (pathname) => {
      return pathname === "/ren" || pathname === `${base}/ren`;
    };
    const resolvePageKey = (pathname) => {
      if (isHomePath(pathname)) return "home";
      if (isGamesIndexPath(pathname)) return "games";
      if (pathname.includes("/games/darts-cricket")) return "darts-cricket";
      if (pathname.includes("/games/dominoes")) return "dominoes";
      if (pathname.includes("/games/oh-hell")) return "oh-hell";
      if (pathname.includes("/games/8-ball-pool")) return "pool-league";
      if (pathname.includes("/games/pass-the-pigs")) return "pass-the-pigs";
      if (isRenIndexPath(pathname)) return "ren";
      if (pathname.includes("/ren/glass-weight-calculator")) return "glass-weight-calculator";
      return "default";
    };
    pageKey = resolvePageKey(store_get($$store_subs ??= {}, "$page", page).url.pathname);
    if (typeof document !== "undefined") {
      document.body.dataset.page = pageKey;
    }
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<link rel="icon"${attr("href", `${stringify(base)}/knot.png`)} type="image/png"/> <link rel="icon"${attr("href", `${stringify(base)}/icons/icon-32.png`)} sizes="32x32" type="image/png"/> <link rel="icon"${attr("href", `${stringify(base)}/icons/icon-16.png`)} sizes="16x16" type="image/png"/> <link rel="apple-touch-icon"${attr("href", `${stringify(base)}/icons/apple-touch-icon.png`)} sizes="180x180"/> `);
      if (isGamesPath(store_get($$store_subs ??= {}, "$page", page).url.pathname)) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<link rel="manifest"${attr("href", `${stringify(base)}/games/manifest.json`)}/>`);
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<link rel="manifest"${attr("href", `${stringify(base)}/manifest.json`)}/>`);
      }
      $$renderer3.push(`<!--]--> <meta name="apple-mobile-web-app-capable" content="yes"/> <meta name="apple-mobile-web-app-title" content="Scorecards"/> <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>`);
    });
    $$renderer2.push(`<main${attr_class("page svelte-12qhfyh", void 0, {
      "top-content": isGamesIndexPath(store_get($$store_subs ??= {}, "$page", page).url.pathname) || isRenPath(store_get($$store_subs ??= {}, "$page", page).url.pathname),
      "center-content": isGamesSubpath(store_get($$store_subs ??= {}, "$page", page).url.pathname),
      "top-centered-content": isHomePath(store_get($$store_subs ??= {}, "$page", page).url.pathname)
    })}${attr("data-page", pageKey)}><section class="content svelte-12qhfyh"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></section></main> <button class="theme-toggle svelte-12qhfyh" type="button"${attr("aria-pressed", theme === "dark")} aria-label="Toggle dark mode" title="Toggle dark mode" data-testid="theme-toggle"><span class="theme-icon svelte-12qhfyh" aria-hidden="true">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" class="svelte-12qhfyh"><path fill="currentColor" d="M12.7 3.4a1 1 0 0 1 .2 1.98 7.5 7.5 0 1 0 7.72 10.92 1 1 0 0 1 1.69.96A9.5 9.5 0 1 1 12.7 3.4z"></path></svg>`);
    }
    $$renderer2.push(`<!--]--></span></button>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
