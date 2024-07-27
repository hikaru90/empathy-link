<script lang="ts">
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
	import { locale } from '$lib/translations';
	import { user } from '$store/auth';

	export let record;
	// export let adversary;

	console.log('record', record);

	const tableRows = [
		{ icon: IconEye, color: 'observation', type: 'text', content: record.observation },
		{
			icon: IconHeart,
			color: 'feelings',
			type: 'array',
			content: record.expand.feelings
		},
		{ icon: IconSwirl, color: 'needs', type: 'array', content: record.expand.needs },
		{ icon: IconSteps, color: 'request', type: 'text', content: record.request }
	];
</script>

<div class="{$user.id === record.owner ? 'justify-start' : 'justify-end'} mb-3 flex">
	<div class="rounded-full bg-neutral-400 bg-opacity-50 px-3 py-1 text-xs text-black">
		{$user.id === record.owner ? $user.firstName : record.expand.fight.name} — {new Date(
			record.created
		).toLocaleDateString('de-DE')}
	</div>
</div>

<div
	class="{$user.id === record.owner
		? 'mr-10'
		: 'ml-10'} relative mb-10 flex flex-col overflow-hidden rounded-xl shadow-xl"
>
	{#each tableRows as row}
		<div
			class="group flex items-stretch border-b border-black/5 bg-almostwhite text-xs shadow-md last:border-b-0"
		>
			<div
				class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3 group-first:pt-6 group-last:pb-6"
			>
				<div class="label bg-{row.color}-background">
					<div class="label-shadow"></div>
					<div class="icon fill-{row.color}-foreground">
						{@html row.icon}
					</div>
				</div>
			</div>
			<div class="flex-grow break-all px-3 pb-3 pt-3 group-first:pt-6 group-last:pb-6">
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
		@apply relative z-10 h-6 w-6 flex-shrink-0 rounded-full border border-white;
	}
	.label-shadow {
		box-shadow: /*inset 0 0 4px rgba(0, 0, 0, 0.4),*/ -4px -4px 8px 0 rgba(white, 1);
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
