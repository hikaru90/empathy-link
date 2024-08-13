<script lang="ts">
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import type { PageData } from '../../app/selfempathy/$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	// export let data: PageData;

	console.log('login page');
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow">
		<AppBottomMenu />

		<h1>Selfempathy</h1>
	</div>
</div>
