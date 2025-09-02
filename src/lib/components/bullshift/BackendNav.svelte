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
		}
	]);
</script>

<div class="flex items-center justify-center gap-2 mb-6">
	{#each links as link}
		<a
			href={link.href}
			class="{currentPage == link.href
				? 'text-primary'
				: 'text-muted-foreground'} rounded-full border border-white/20 bg-offwhite px-3 py-1 shadow-md shadow-black/5"
			>{link.label}</a
		>
	{/each}
</div>
