<script>
	import { t, initialized } from '$lib/translations';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { blur } from 'svelte/transition';
	import { Toaster } from "$lib/components/ui/sonner";
	import AppMenu from '$lib/components/AppMenu.svelte'
	import { onMount } from 'svelte';

	export let data;
	let contentReady = false;

	console.log('user', data.user);

	const animationDuration = 400;

	onMount(() => {
		contentReady = true
	})
</script>
{#key data.url}
	<main
		in:blur={{ duration: animationDuration, delay: animationDuration }}
		out:blur={{ duration: animationDuration }}
		class="flex flex-grow flex-col"
	>
		{#if !contentReady}
			<div
				in:blur={{ duration: animationDuration, delay: animationDuration }}
				out:blur={{ duration: animationDuration }}
				class="flex items-center justify-center py-60"
			>
				<SparklePill fast={true} class="h-6 w-16 shadow-xl dark:shadow-gray-200/30" />
			</div>
		{:else}
			<div
				in:blur={{ duration: animationDuration, delay: animationDuration }}
				out:blur={{ duration: animationDuration }}
			>
				<ModeWatcher />
				<slot />
			</div>
			<AppMenu />
		{/if}
	</main>
{/key}
<Toaster />

<style lang="scss">
	@import '../assets/styles/style.scss';
</style>
