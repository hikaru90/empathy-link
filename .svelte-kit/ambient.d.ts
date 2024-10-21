
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
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
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const HOST: string;
	export const PORT: string;
	export const PRIVATE_BREVO_API_KEY: string;
	export const PRIVATE_GEMINI_API_KEY: string;
	export const ALLUSERSPROFILE: string;
	export const APPDATA: string;
	export const ChocolateyInstall: string;
	export const ChocolateyLastPathUpdate: string;
	export const CHROME_CRASHPAD_PIPE_NAME: string;
	export const COLORTERM: string;
	export const CommonProgramFiles: string;
	export const CommonProgramW6432: string;
	export const COMPUTERNAME: string;
	export const ComSpec: string;
	export const CUDA_PATH: string;
	export const CUDA_PATH_V11_2: string;
	export const DriverData: string;
	export const EFC_20072: string;
	export const FPS_BROWSER_APP_PROFILE_STRING: string;
	export const FPS_BROWSER_USER_PROFILE_STRING: string;
	export const GDAL_DATA: string;
	export const GDAL_DRIVER_PATH: string;
	export const GDAL_VERSION: string;
	export const GIT_ASKPASS: string;
	export const HOME: string;
	export const HOMEDRIVE: string;
	export const HOMEPATH: string;
	export const INIT_CWD: string;
	export const INTEL_DEV_REDIST: string;
	export const JAVA_HOME: string;
	export const KUBECONFIG: string;
	export const LANG: string;
	export const LOCALAPPDATA: string;
	export const LOGONSERVER: string;
	export const MIC_LD_LIBRARY_PATH: string;
	export const NODE: string;
	export const NODE_ENV: string;
	export const NODE_PATH: string;
	export const npm_command: string;
	export const npm_config_engine_strict: string;
	export const npm_config_frozen_lockfile: string;
	export const npm_config_node_gyp: string;
	export const npm_config_registry: string;
	export const npm_config_user_agent: string;
	export const npm_execpath: string;
	export const npm_lifecycle_event: string;
	export const npm_lifecycle_script: string;
	export const npm_node_execpath: string;
	export const npm_package_dependencies_bits_ui: string;
	export const npm_package_dependencies_clsx: string;
	export const npm_package_dependencies_formsnap: string;
	export const npm_package_dependencies_mode_watcher: string;
	export const npm_package_dependencies_openai: string;
	export const npm_package_dependencies_posthog_js: string;
	export const npm_package_dependencies_radix_icons_svelte: string;
	export const npm_package_dependencies_resize_observer_polyfill: string;
	export const npm_package_dependencies_simplebar: string;
	export const npm_package_dependencies_svelte_radix: string;
	export const npm_package_dependencies_tailwind_merge: string;
	export const npm_package_dependencies_tailwind_variants: string;
	export const npm_package_dependencies_uuid: string;
	export const npm_package_dependencies_vaul_svelte: string;
	export const npm_package_dependencies__azure_identity: string;
	export const npm_package_dependencies__azure_openai: string;
	export const npm_package_dependencies__google_generative_ai: string;
	export const npm_package_dependencies__internationalized_date: string;
	export const npm_package_dependencies__internationalized_number: string;
	export const npm_package_devDependencies_autoprefixer: string;
	export const npm_package_devDependencies_d3: string;
	export const npm_package_devDependencies_dotenv: string;
	export const npm_package_devDependencies_jimp: string;
	export const npm_package_devDependencies_pocketbase: string;
	export const npm_package_devDependencies_postcss: string;
	export const npm_package_devDependencies_postcss_import: string;
	export const npm_package_devDependencies_postcss_load_config: string;
	export const npm_package_devDependencies_prettier: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const npm_package_devDependencies_prettier_plugin_tailwindcss: string;
	export const npm_package_devDependencies_sass: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_devDependencies_sveltekit_i18n: string;
	export const npm_package_devDependencies_sveltekit_superforms: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const npm_package_devDependencies_svelte_copy: string;
	export const npm_package_devDependencies_svelte_preprocess: string;
	export const npm_package_devDependencies_svelte_sonner: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_package_devDependencies_typescript: string;
	export const npm_package_devDependencies_vite: string;
	export const npm_package_devDependencies_zod: string;
	export const npm_package_devDependencies__capacitor_android: string;
	export const npm_package_devDependencies__capacitor_cli: string;
	export const npm_package_devDependencies__capacitor_core: string;
	export const npm_package_devDependencies__capacitor_geolocation: string;
	export const npm_package_devDependencies__capacitor_ios: string;
	export const npm_package_devDependencies__playwright_test: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies__sveltejs_adapter_node: string;
	export const npm_package_devDependencies__sveltejs_adapter_static: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_engines_node: string;
	export const npm_package_name: string;
	export const npm_package_private: string;
	export const npm_package_scripts_android: string;
	export const npm_package_scripts_build: string;
	export const npm_package_scripts_buildprod: string;
	export const npm_package_scripts_check: string;
	export const npm_package_scripts_check_watch: string;
	export const npm_package_scripts_dev: string;
	export const npm_package_scripts_format: string;
	export const npm_package_scripts_lint: string;
	export const npm_package_scripts_preview: string;
	export const npm_package_scripts_sync: string;
	export const npm_package_scripts_test: string;
	export const npm_package_type: string;
	export const npm_package_version: string;
	export const NUMBER_OF_PROCESSORS: string;
	export const NVCUDASAMPLES11_2_ROOT: string;
	export const NVCUDASAMPLES_ROOT: string;
	export const NVM_HOME: string;
	export const NVM_SYMLINK: string;
	export const NVTOOLSEXT_PATH: string;
	export const OneDrive: string;
	export const OneDriveConsumer: string;
	export const OPENSSL_CONF: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const OS: string;
	export const Path: string;
	export const PATHEXT: string;
	export const PNPM_HOME: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const POSTGIS_ENABLE_OUTDB_RASTERS: string;
	export const POSTGIS_GDAL_ENABLED_DRIVERS: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const PROCESSOR_LEVEL: string;
	export const PROCESSOR_REVISION: string;
	export const ProgramData: string;
	export const ProgramFiles: string;
	export const ProgramW6432: string;
	export const PROJ_LIB: string;
	export const PROMPT: string;
	export const PSModulePath: string;
	export const PUBLIC: string;
	export const PYTHONPATH: string;
	export const SESSIONNAME: string;
	export const SystemDrive: string;
	export const SystemRoot: string;
	export const TEMP: string;
	export const TERM_PROGRAM: string;
	export const TERM_PROGRAM_VERSION: string;
	export const TMP: string;
	export const USERDOMAIN: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const USERNAME: string;
	export const USERPROFILE: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const WebStorm: string;
	export const windir: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_POSTHOG_KEY: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		HOST: string;
		PORT: string;
		PRIVATE_BREVO_API_KEY: string;
		PRIVATE_GEMINI_API_KEY: string;
		ALLUSERSPROFILE: string;
		APPDATA: string;
		ChocolateyInstall: string;
		ChocolateyLastPathUpdate: string;
		CHROME_CRASHPAD_PIPE_NAME: string;
		COLORTERM: string;
		CommonProgramFiles: string;
		CommonProgramW6432: string;
		COMPUTERNAME: string;
		ComSpec: string;
		CUDA_PATH: string;
		CUDA_PATH_V11_2: string;
		DriverData: string;
		EFC_20072: string;
		FPS_BROWSER_APP_PROFILE_STRING: string;
		FPS_BROWSER_USER_PROFILE_STRING: string;
		GDAL_DATA: string;
		GDAL_DRIVER_PATH: string;
		GDAL_VERSION: string;
		GIT_ASKPASS: string;
		HOME: string;
		HOMEDRIVE: string;
		HOMEPATH: string;
		INIT_CWD: string;
		INTEL_DEV_REDIST: string;
		JAVA_HOME: string;
		KUBECONFIG: string;
		LANG: string;
		LOCALAPPDATA: string;
		LOGONSERVER: string;
		MIC_LD_LIBRARY_PATH: string;
		NODE: string;
		NODE_ENV: string;
		NODE_PATH: string;
		npm_command: string;
		npm_config_engine_strict: string;
		npm_config_frozen_lockfile: string;
		npm_config_node_gyp: string;
		npm_config_registry: string;
		npm_config_user_agent: string;
		npm_execpath: string;
		npm_lifecycle_event: string;
		npm_lifecycle_script: string;
		npm_node_execpath: string;
		npm_package_dependencies_bits_ui: string;
		npm_package_dependencies_clsx: string;
		npm_package_dependencies_formsnap: string;
		npm_package_dependencies_mode_watcher: string;
		npm_package_dependencies_openai: string;
		npm_package_dependencies_posthog_js: string;
		npm_package_dependencies_radix_icons_svelte: string;
		npm_package_dependencies_resize_observer_polyfill: string;
		npm_package_dependencies_simplebar: string;
		npm_package_dependencies_svelte_radix: string;
		npm_package_dependencies_tailwind_merge: string;
		npm_package_dependencies_tailwind_variants: string;
		npm_package_dependencies_uuid: string;
		npm_package_dependencies_vaul_svelte: string;
		npm_package_dependencies__azure_identity: string;
		npm_package_dependencies__azure_openai: string;
		npm_package_dependencies__google_generative_ai: string;
		npm_package_dependencies__internationalized_date: string;
		npm_package_dependencies__internationalized_number: string;
		npm_package_devDependencies_autoprefixer: string;
		npm_package_devDependencies_d3: string;
		npm_package_devDependencies_dotenv: string;
		npm_package_devDependencies_jimp: string;
		npm_package_devDependencies_pocketbase: string;
		npm_package_devDependencies_postcss: string;
		npm_package_devDependencies_postcss_import: string;
		npm_package_devDependencies_postcss_load_config: string;
		npm_package_devDependencies_prettier: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		npm_package_devDependencies_prettier_plugin_tailwindcss: string;
		npm_package_devDependencies_sass: string;
		npm_package_devDependencies_svelte: string;
		npm_package_devDependencies_sveltekit_i18n: string;
		npm_package_devDependencies_sveltekit_superforms: string;
		npm_package_devDependencies_svelte_check: string;
		npm_package_devDependencies_svelte_copy: string;
		npm_package_devDependencies_svelte_preprocess: string;
		npm_package_devDependencies_svelte_sonner: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_package_devDependencies_tslib: string;
		npm_package_devDependencies_typescript: string;
		npm_package_devDependencies_vite: string;
		npm_package_devDependencies_zod: string;
		npm_package_devDependencies__capacitor_android: string;
		npm_package_devDependencies__capacitor_cli: string;
		npm_package_devDependencies__capacitor_core: string;
		npm_package_devDependencies__capacitor_geolocation: string;
		npm_package_devDependencies__capacitor_ios: string;
		npm_package_devDependencies__playwright_test: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies__sveltejs_adapter_node: string;
		npm_package_devDependencies__sveltejs_adapter_static: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_engines_node: string;
		npm_package_name: string;
		npm_package_private: string;
		npm_package_scripts_android: string;
		npm_package_scripts_build: string;
		npm_package_scripts_buildprod: string;
		npm_package_scripts_check: string;
		npm_package_scripts_check_watch: string;
		npm_package_scripts_dev: string;
		npm_package_scripts_format: string;
		npm_package_scripts_lint: string;
		npm_package_scripts_preview: string;
		npm_package_scripts_sync: string;
		npm_package_scripts_test: string;
		npm_package_type: string;
		npm_package_version: string;
		NUMBER_OF_PROCESSORS: string;
		NVCUDASAMPLES11_2_ROOT: string;
		NVCUDASAMPLES_ROOT: string;
		NVM_HOME: string;
		NVM_SYMLINK: string;
		NVTOOLSEXT_PATH: string;
		OneDrive: string;
		OneDriveConsumer: string;
		OPENSSL_CONF: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		OS: string;
		Path: string;
		PATHEXT: string;
		PNPM_HOME: string;
		PNPM_SCRIPT_SRC_DIR: string;
		POSTGIS_ENABLE_OUTDB_RASTERS: string;
		POSTGIS_GDAL_ENABLED_DRIVERS: string;
		PROCESSOR_ARCHITECTURE: string;
		PROCESSOR_IDENTIFIER: string;
		PROCESSOR_LEVEL: string;
		PROCESSOR_REVISION: string;
		ProgramData: string;
		ProgramFiles: string;
		ProgramW6432: string;
		PROJ_LIB: string;
		PROMPT: string;
		PSModulePath: string;
		PUBLIC: string;
		PYTHONPATH: string;
		SESSIONNAME: string;
		SystemDrive: string;
		SystemRoot: string;
		TEMP: string;
		TERM_PROGRAM: string;
		TERM_PROGRAM_VERSION: string;
		TMP: string;
		USERDOMAIN: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		USERNAME: string;
		USERPROFILE: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		VSCODE_GIT_IPC_HANDLE: string;
		WebStorm: string;
		windir: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_POSTHOG_KEY: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
