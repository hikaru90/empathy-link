<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	export let data: PageData;

	console.log('login page');
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow">
		<Menu />

		<h1>Selfempathy</h1>
	</div>
</div>
