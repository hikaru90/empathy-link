<script lang="ts">
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import type { PageData } from '../../app/selfempathy/$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { m } from '$lib/translations';
	import { goto } from '$app/navigation';
	import { backgroundColor } from '$store/page';
	import { onMount } from 'svelte';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left'
	import Heart from 'lucide-svelte/icons/heart'
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import { Button as SparkleButton } from '$lib/components/ui/button-sparkle';


	interface Props {
		data: App.Locals;
	}

	let { data }: Props = $props();

	onMount(() => {
		backgroundColor.set('bg-background');
	});
</script>

	<div class="flex h-full flex-grow flex-col justify-between overflow-hidden">
		<AppTopMenu />
		<div class="max-container flex-grow pb-40">
			<div
				class="relative z-10 mb-8 flex flex-row items-start justify-between py-4 md:items-center md:bg-transparent md:pb-6"
			>
				<h1 class="font-heading text-lg font-semibold">{m.page_selfempathy_heading()}</h1>
			</div>


			<AppBottomMenu>
				<div class="relative flex h-auto items-center justify-between">
					<a href="/app/dashboard" class="block">
						<Button
							decoration="dark-op1"
							class="flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
						>
							<ChevronLeft class="h-4 w-4 rounded-full" />
						</Button>
					</a>
					<a href="/app/selfempathy/create" class="skeumorphic-button-dark inline-block rounded-full mr-1 md:mr-0.5">
						<SparkleButton
							class="flex items-center justify-between gap-10 rounded-full pl-5 pr-3 font-bold text-black dark:shadow-gray-300/30"
						>
							{m.page_selfempathy_create()}
							<Heart class="h-4 w-4 text-red-600
							" />
						</SparkleButton>
					</a>
				</div>
			</AppBottomMenu>
		</div>
	</div>
