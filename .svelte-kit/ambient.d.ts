
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const CLAUDE_CODE_CONTAINER_ID: string;
	export const CLAUDE_CODE_BASE_REF: string;
	export const GLOBAL_AGENT_HTTPS_PROXY: string;
	export const HTTPS_PROXY: string;
	export const CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2: string;
	export const no_proxy: string;
	export const NODE_EXTRA_CA_CERTS: string;
	export const CLAUDE_CODE_ENTRYPOINT: string;
	export const CODESIGN_MCP_TOKEN: string;
	export const CLAUDE_CODE_REMOTE_SEND_KEEPALIVES: string;
	export const RUST_BACKTRACE: string;
	export const npm_config_user_agent: string;
	export const JAVA_TOOL_OPTIONS: string;
	export const GIT_EDITOR: string;
	export const BUN_INSTALL: string;
	export const npm_node_execpath: string;
	export const SHLVL: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const RBENV_ROOT: string;
	export const OLDPWD: string;
	export const NO_PROXY: string;
	export const npm_package_json: string;
	export const PYTHONUNBUFFERED: string;
	export const NODE_OPTIONS: string;
	export const CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR: string;
	export const SSL_CERT_FILE: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const USE_BUILTIN_RIPGREP: string;
	export const COLOR: string;
	export const npm_config_https_proxy: string;
	export const YARN_HTTP_PROXY: string;
	export const https_proxy: string;
	export const CLAUDE_SESSION_INGRESS_TOKEN_FILE: string;
	export const http_proxy: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const npm_config_npm_version: string;
	export const CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE: string;
	export const CLAUDE_CODE_REMOTE: string;
	export const npm_config_proxy: string;
	export const ANTHROPIC_BASE_URL: string;
	export const TERM: string;
	export const OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
	export const npm_config_cache: string;
	export const MCP_TOOL_TIMEOUT: string;
	export const RUSTUP_HOME: string;
	export const YARN_HTTPS_PROXY: string;
	export const SKIP_PLUGIN_MARKETPLACE: string;
	export const CLAUDE_AFTER_LAST_COMPACT: string;
	export const CODESIGN_MCP_PORT: string;
	export const MCP_CONNECTION_NONBLOCKING: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const REQUESTS_CA_BUNDLE: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const COREPACK_ENABLE_AUTO_PIN: string;
	export const ENVRUNNER_SKIP_ACK: string;
	export const CLAUDE_CODE_PROXY_RESOLVES_HOSTS: string;
	export const CLAUDE_CODE_DIAGNOSTICS_FILE: string;
	export const NoDefaultCurrentDirectoryInExePath: string;
	export const CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION: string;
	export const ELECTRON_GET_USE_PROXY: string;
	export const npm_lifecycle_script: string;
	export const CCR_TEST_GITPROXY: string;
	export const CLAUDE_ENABLE_STREAM_WATCHDOG: string;
	export const DEBIAN_FRONTEND: string;
	export const SHELL: string;
	export const GLOBAL_AGENT_NO_PROXY: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const CLAUDE_AUTO_BACKGROUND_TASKS: string;
	export const CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES: string;
	export const CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR: string;
	export const CLAUDE_CODE_SESSION_ID: string;
	export const CLAUDE_CODE_VERSION: string;
	export const CLAUDECODE: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const MAX_THINKING_TOKENS: string;
	export const CLAUDE_CODE_DEBUG: string;
	export const JAVA_HOME: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const GLOBAL_AGENT_HTTP_PROXY: string;
	export const npm_config_global_prefix: string;
	export const IS_SANDBOX: string;
	export const ENV_MANAGER_ENABLE_DIAG_LOGS: string;
	export const USE_SHTTP_MCP: string;
	export const HTTP_PROXY: string;
	export const npm_command: string;
	export const CLAUDE_CODE_REMOTE_SESSION_ID: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		CLAUDE_CODE_CONTAINER_ID: string;
		CLAUDE_CODE_BASE_REF: string;
		GLOBAL_AGENT_HTTPS_PROXY: string;
		HTTPS_PROXY: string;
		CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2: string;
		no_proxy: string;
		NODE_EXTRA_CA_CERTS: string;
		CLAUDE_CODE_ENTRYPOINT: string;
		CODESIGN_MCP_TOKEN: string;
		CLAUDE_CODE_REMOTE_SEND_KEEPALIVES: string;
		RUST_BACKTRACE: string;
		npm_config_user_agent: string;
		JAVA_TOOL_OPTIONS: string;
		GIT_EDITOR: string;
		BUN_INSTALL: string;
		npm_node_execpath: string;
		SHLVL: string;
		npm_config_noproxy: string;
		HOME: string;
		RBENV_ROOT: string;
		OLDPWD: string;
		NO_PROXY: string;
		npm_package_json: string;
		PYTHONUNBUFFERED: string;
		NODE_OPTIONS: string;
		CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR: string;
		SSL_CERT_FILE: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		USE_BUILTIN_RIPGREP: string;
		COLOR: string;
		npm_config_https_proxy: string;
		YARN_HTTP_PROXY: string;
		https_proxy: string;
		CLAUDE_SESSION_INGRESS_TOKEN_FILE: string;
		http_proxy: string;
		_: string;
		npm_config_prefix: string;
		npm_config_npm_version: string;
		CLAUDE_CODE_REMOTE_ENVIRONMENT_TYPE: string;
		CLAUDE_CODE_REMOTE: string;
		npm_config_proxy: string;
		ANTHROPIC_BASE_URL: string;
		TERM: string;
		OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: string;
		npm_config_cache: string;
		MCP_TOOL_TIMEOUT: string;
		RUSTUP_HOME: string;
		YARN_HTTPS_PROXY: string;
		SKIP_PLUGIN_MARKETPLACE: string;
		CLAUDE_AFTER_LAST_COMPACT: string;
		CODESIGN_MCP_PORT: string;
		MCP_CONNECTION_NONBLOCKING: string;
		npm_config_node_gyp: string;
		PATH: string;
		REQUESTS_CA_BUNDLE: string;
		NODE: string;
		npm_package_name: string;
		COREPACK_ENABLE_AUTO_PIN: string;
		ENVRUNNER_SKIP_ACK: string;
		CLAUDE_CODE_PROXY_RESOLVES_HOSTS: string;
		CLAUDE_CODE_DIAGNOSTICS_FILE: string;
		NoDefaultCurrentDirectoryInExePath: string;
		CLAUDE_CODE_ENVIRONMENT_RUNNER_VERSION: string;
		ELECTRON_GET_USE_PROXY: string;
		npm_lifecycle_script: string;
		CCR_TEST_GITPROXY: string;
		CLAUDE_ENABLE_STREAM_WATCHDOG: string;
		DEBIAN_FRONTEND: string;
		SHELL: string;
		GLOBAL_AGENT_NO_PROXY: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		CLAUDE_AUTO_BACKGROUND_TASKS: string;
		CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES: string;
		CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR: string;
		CLAUDE_CODE_SESSION_ID: string;
		CLAUDE_CODE_VERSION: string;
		CLAUDECODE: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		MAX_THINKING_TOKENS: string;
		CLAUDE_CODE_DEBUG: string;
		JAVA_HOME: string;
		PWD: string;
		npm_execpath: string;
		GLOBAL_AGENT_HTTP_PROXY: string;
		npm_config_global_prefix: string;
		IS_SANDBOX: string;
		ENV_MANAGER_ENABLE_DIAG_LOGS: string;
		USE_SHTTP_MCP: string;
		HTTP_PROXY: string;
		npm_command: string;
		CLAUDE_CODE_REMOTE_SESSION_ID: string;
		INIT_CWD: string;
		EDITOR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
