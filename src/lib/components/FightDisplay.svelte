<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
	import { NumberFormatter } from '@internationalized/number';
	import { t, locale } from '$lib/translations';
	import { user } from '$store/auth';

	export let record;
	export let adversary;

	console.log('record', record);
</script>

<div class="{$user.id === record.owner ? 'justify-start' : 'justify-end'} mb-2 flex">
	<div
		class="{$user.id === record.owner
			? 'rounded-t-xl rounded-bl-[2px] rounded-br-xl'
			: 'rounded-t-xl rounded-bl-xl rounded-br-[2px]'} bg-slate-300 px-3 py-1 text-xs"
	>
		{$user.id === record.owner ? $user.firstName : record.expand.fight.name} — {new Date(
			record.created
		).toLocaleDateString('de-DE')}
	</div>
</div>

<div class="relative flex flex-col">
	<Card.Root
		class="{$user.id === record.owner
			? 'mr-10 self-start rounded-tl-sm rounded-tr-xl'
			: 'ml-10 self-end rounded-tl-xl rounded-tr-sm'} card-root w-[calc(100%-16px)] max-w-96 rounded-b-xl border-0 bg-white/40 text-xs"
	>
		<Card.Header class="px-3 py-4">
			<Card.Title class="flex items-start gap-2 font-normal">
				<div class="label bg-observation-background fill-observation-foreground">
					<div class="icon">
						{@html IconEye}
					</div>
				</div>
				<p class="mt-1">{record.observation}</p>
			</Card.Title>
		</Card.Header>
		<Card.Header class="px-3 py-4">
			<Card.Title class="flex items-start gap-2 font-normal">
				<div class="label bg-feelings-background fill-feelings-foreground">
					<div class="icon">
						{@html IconHeart}
					</div>
				</div>
				<div class="flex flex-wrap gap-1">
					{#each Object.values(record.expand.feelings) as feeling}
						<span class="rounded-full bg-feelings-background px-3 py-0.5">
							{$locale === 'en' ? feeling.nameEN : feeling.nameDE}
						</span>
					{/each}
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Header class="px-3 py-4">
			<Card.Title class="flex items-start gap-2 font-normal">
				<div class="label bg-needs-background fill-needs-foreground">
					<div class="icon">
						{@html IconSwirl}
					</div>
				</div>
				<div class="flex flex-wrap gap-1">
					{#each Object.values(record.expand.needs) as need}
						{#if need.nameEN.length > 10 || need.nameDE.length > 10}
							<div class="leading-relaxed">
								<span class="need rounded-full bg-needs-background px-3 py-0.5">
									{$locale === 'en' ? need.nameEN : need.nameDE}
								</span>
							</div>
						{:else}
							<span class="need rounded-full bg-needs-background px-3 py-0.5">
								{$locale === 'en' ? need.nameEN : need.nameDE}
							</span>
						{/if}
					{/each}
				</div>
			</Card.Title>
		</Card.Header>
		<Card.Header class="px-3 py-4">
			<Card.Title class="flex items-start gap-2 font-normal">
				<div class="label bg-request-background fill-request-foreground">
					<div class="icon">
						{@html IconSteps}
					</div>
				</div>
				<p class="mt-1">{record.request}</p>
			</Card.Title>
		</Card.Header>
	</Card.Root>
</div>

<style lang="scss">
	.label {
		box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.4);
		@apply relative h-5 w-5 flex-shrink-0 rounded-full;
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
