<script lang="ts">
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
	import { locale } from '$lib/translations';
	import { Check } from 'radix-icons-svelte';
	import { user } from '$store/auth';

	export let record;
	export let fight: object | undefined = undefined;
	// export let adversary;

	console.log('record', record);

	const overlap = (type: string = 'feelings') => {
		if (!fight) return undefined
		const fightArray = fight[type];
		const responseArray = record[type];
		
		let count = 0
		const fightArrayCount = fightArray.length;
		responseArray.forEach((entry) => {
			if(fightArray.includes(entry)) count++
		});
		return Math.round(count * 100 / fightArrayCount);
	};

	const tableRows = [
		{ icon: IconEye, color: 'observation', type: 'text', content: record.observation },
		{
			icon: IconHeart,
			color: 'feelings',
			type: 'array',
			overlap: overlap('feelings'),
			content: record.expand.feelings
		},
		{
			icon: IconSwirl,
			color: 'needs',
			type: 'array',
			overlap: overlap('needs'),
			content: record.expand.needs
		},
		{ icon: IconSteps, color: 'request', type: 'text', content: record.request }
	];
</script>

<div
	class="{$user.id === record.owner ? 'justify-start' : 'justify-end'} mb-3 flex items-center gap-2"
>
	<div class="rounded-full bg-neutral-400 bg-opacity-50 px-3 py-1 text-xs text-black">
		{$user.id === record.owner ? $user.firstName : record.expand.fight.name} — {new Date(
			record.created
		).toLocaleDateString('de-DE')}
	</div>
	{#if $user.id === record.owner && record.opened}
		<div class="flex items-center rounded-full bg-green-600 px-1 py-[2px] text-2xs text-green-300">
			<Check />
			<Check class="-ml-2" />
		</div>
	{/if}
</div>

<div
	class="{$user.id === record.owner
		? 'mr-10'
		: 'ml-10'} relative mb-10 flex flex-col overflow-hidden rounded-xl shadow-xl"
>
	{#each tableRows as row}
		<div
			class="group flex items-stretch border-b border-black/5 bg-almostwhite text-xs shadow-md last:border-b-0 dark:bg-muted"
		>
			<div
				class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3 group-first:pt-6 group-last:pb-6"
			>
				<div class="label bg-{row.color}-background dark:bg-muted/40">
					<div class="label-shadow"></div>
					<div class="icon fill-{row.color}-foreground">
						{@html row.icon}
					</div>
				</div>
			</div>
			<div class="flex-grow break-all px-3 pb-3 pt-3 group-first:pt-6 group-last:pb-6">
				{#if row.overlap}
				<div class="flex items-center">
					<div class="border border-{row.color}-background rounded-full px-2 py-0.5 mb-2 text-xs">
						{row.overlap}%
						{$locale === 'en' ? 'overlap' : 'Überschneidung'}
					</div>
				</div>
				{/if}
				{#if row.type === 'text'}
					{row.content}
				{:else}
					<div class="flex flex-wrap gap-2">
						{#each row.content as entry}
							<div class="bg-{row.color}-background rounded-full px-2 py-0.5">
								<!-- {JSON.stringify(entry)} -->
								{$locale === 'en' ? entry.nameEN : entry.nameDE}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.label {
		box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.4);
		@apply relative z-10 h-6 w-6 flex-shrink-0 rounded-full border border-white dark:border-muted;
	}
	.label-shadow {
		box-shadow: var(--skeumorphic-shadow-dark);
		@apply absolute left-0 top-0 z-0 block h-full w-full rounded-full;
	}
	.icon {
		@apply absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 transform;
	}

	:global(.card-root) {
		box-shadow:
			-5px -5px 5px rgba(255, 255, 255, 0.9),
			5px 5px 5px rgba(0, 0, 0, 0.1);
	}

	.need {
		@apply relative z-10 inline;

		&:before {
			content: '';
			@apply absolute left-0 top-0 h-full w-full;
			z-index: -1; /* Ensure the background is behind the text */
		}
	}
</style>
