<script lang="ts">
	import { page } from '$app/state';

	let currentPage = $state(page.url.pathname);
	let links = $state([
		{
			label: 'Home',
			href: '/bullshift/backend'
		},
		{
			label: 'Evals',
			href: '/bullshift/backend/evals'
		},
		{
			label: 'Feedback',
			href: '/bullshift/backend/feedback'
		},
		{
			label: 'Prompts',
			href: '/bullshift/backend/prompts'
		},
		{
			label: 'Prompt Performance',
			href: '/bullshift/backend/prompt-performance'
		},
	]);
</script>

<div class="flex items-center justify-center gap-2 mb-6">
	{#each links as link}
		<a
			href={link.href}
			class="{currentPage == link.href
				? 'text-black border-white/40'
				: 'text-muted-foreground border-white/20'} rounded-full border bg-offwhite px-3 py-1 shadow-sm shadow-black/5"
			>{link.label}</a
		>
	{/each}
</div>
