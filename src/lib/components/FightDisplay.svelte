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
		{ icon: IconEye, color: 'observation-background', type: 'text', content: record.observation },
		{ icon: IconHeart, color: 'feelings-background', type: 'array', content: record.expand.feelings },
		{ icon: IconSwirl, color: 'needs-background', type: 'array', content: record.expand.needs },
		{ icon: IconSteps, color: 'request-background', type: 'text', content: record.request },
	];
</script>

<div class="{$user.id === record.owner ? 'justify-start' : 'justify-end'} mb-2 flex">
	<div
		class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
	>
		{$user.id === record.owner ? $user.firstName : record.expand.fight.name} — {new Date(
			record.created
		).toLocaleDateString('de-DE')}
	</div>
</div>

<div class="{$user.id === record.owner ? 'mr-10' : 'ml-10'} relative flex flex-col mb-10 rounded-md overflow-hidden shadow-xl">
	{#each tableRows as row}
		<div class="group flex items-stretch bg-white text-xs shadow-md border-b border-black/5 last:border-b-0">
			<div class="flex-shrink-0 pt-3 pb-3 px-3 group-first:pt-6 group-last:pb-6 border-r border-black/5 flex items-center justify-center">
				<div class="label bg-{row.color}">
					<div class="icon">
						{@html row.icon}
					</div>
				</div>
			</div>
			<div class="flex-grow pt-3 pb-3 px-3 group-first:pt-6 group-last:pb-6 break-all">
				{#if row.type === 'text'}
					{row.content}
				{:else}
				<div class="flex flex-wrap gap-2">
					{#each row.content as entry}
					<div class="bg-{row.color} rounded-full px-2 py-0.5">
						<!-- {JSON.stringify(entry)} -->
						{$locale === 'en'? entry.nameEN : entry.nameDE}
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
		box-shadow: /*inset 0 0 4px rgba(0, 0, 0, 0.4),*/ -4px -4px 8px 0 rgba(white,1);
		@apply relative h-5 w-5 flex-shrink-0 rounded-full border border-white;
	}
	.label:after{
		content: '';
		box-shadow: 4px 4px 8px 0 rgba(0,0,0,0.4);
		@apply block rounded-full w-full h-full;
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
