<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
	import { NumberFormatter } from '@internationalized/number';
	import { t, locale } from '$lib/translations';
	import { user } from '$store/auth';
	import backgroundImage from '$assets/images/holo3.jpg';

	export let record;
	export let adversary;
</script>

<div class="relative z-10">
	{#if $user.id === record.owner}
	<div
	style="background-image: url('{backgroundImage}'); background-size: 300% 400%;" class="animate-bg mb-4 inline-flex items-center gap-2 rounded-full bg-black py-1 pl-3 pr-5 text-sm text-black"
	>
		<div class="bg-white h-2.5 w-2.5 rounded-full"></div>
		Du hast diesen Streit angefangen
	</div>
{:else}
	<div
		class="mb-4 mt-10 inline-flex items-center gap-2 rounded-full bg-black py-1 pl-3 pr-5 text-sm text-offwhite"
		>
		<div style="background-image: url('{backgroundImage}'); background-size: 300% 400%;" class="animate-bg h-2.5 w-2.5 rounded-full"></div>
		{adversary} hat geantwortet
	</div>
{/if}
</div>
