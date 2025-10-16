<script lang="ts">
	import { m } from '$lib/translations';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import { getLocale } from '$src/paraglide/runtime';

	import BotMessageSquare from 'lucide-svelte/icons/bot-message-square';
	import ChartColumnDecreasing from 'lucide-svelte/icons/chart-column-decreasing';
	import Book from 'lucide-svelte/icons/book';
	import Users from 'lucide-svelte/icons/users';


	const locale = $derived(getLocale());
	

	interface Card {
		heading: string;
		icon: string;
		text: string;
	}

	let modules = $derived([
		{
			heading: m.page_home_components_modules_modules_selfempathy(),
			icon: BotMessageSquare,
			delayed: false
		},
		{
			heading: m.page_home_components_modules_modules_fight(),
			icon: ChartColumnDecreasing,
			delayed: false
		},
		{
			heading: m.page_home_components_modules_modules_feedback(),
			icon: Book,
			delayed: true
		},
		{
			heading: m.page_home_components_modules_modules_learn(),
			icon: Users,
			delayed: true
		}
	]);
</script>

<div class="mb-10 flex flex-col items-center">
	<div class="relative">
		<div class="relative flex flex-row flex-wrap justify-center gap-4">
			{#each modules as module}
					<div
						class="group relative flex items-center justify-center rounded-[24px] bg-muted p-1 lg:p-3 text-sm shadow-xl md:w-auto"
					>
						<div
							class="absolute left-full top-1/2 hidden h-1 w-4 -translate-y-1/2 transform bg-black/90 dark:bg-neon md:block group-last:md:hidden"
						></div>
						<div
							class="flex size-[40px] md:size-[50px] lg:size-[60px] flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-black p-2 lg:p-4 text-offwhite shadow-xl"
						>
								<module.icon class="size-6" />
						</div>
					</div>
			{/each}
		</div>
	</div>
</div>
