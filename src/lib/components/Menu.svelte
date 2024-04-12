<script>
	// Import any necessary dependencies
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { t } from '$lib/translations';
	import { user } from '$store/auth';

	// Define component properties
	$: menuItems = [
		{ label: $t('default.page.home.nav') },
		{ label: $t('default.page.contact.nav') }
	];

	// Define any component functions or lifecycle hooks
	onMount(() => {
		// Any initialization logic can go here
	});

	// Define any other component-specific functions
	function handleMenuItemClick(item) {
		// Handle click event for menu items
		console.log('Clicked:', item);
	}
</script>

<!-- Component HTML structure -->
<nav class="flex items-center justify-between border-b px-4 py-3 dark:border-gray-200/10">
	<a href="/">
		<Logo />
	</a>
	<div class="flex items-center gap-4">
		{#each menuItems as item}
			<button on:click={() => handleMenuItemClick(item)}>{item.label}</button>
		{/each}
		{#if $user}
			<div class="mr-10">
				<Avatar />
			</div>
		{/if}
	</div>
</nav>
