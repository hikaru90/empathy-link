<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '../../lib/components/LoginForm.svelte';
	export let data: PageData;
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow">
		<Menu />

		<div class="max-container relative">
			<div class="w-full flex items-center justify-center py-32">

				<LoginForm data={data.form} class="w-[400px]" />
			</div>
		</div>
	</div>
</div>
