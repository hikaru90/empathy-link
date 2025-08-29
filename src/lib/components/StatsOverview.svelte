<script lang="ts">
	import { pb } from '$scripts/pocketbase';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { onMount } from 'svelte';
	import StatsFeelings from '$src/lib/components/StatsFeelings.svelte';
	import StatsNeeds from '$src/lib/components/StatsNeeds.svelte';
	import StatsChatOverview from '$src/lib/components/StatsChatOverview.svelte';
	import HeadingExplanation from '$src/lib/components/HeadingExplanation.svelte';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	const getFeelings = () => {
		const feelings = data.analyses.map((analysis) => {
			return analysis.feelings;
		});
		const res = feelings.flat();
		const grouped = res.reduce((acc: { [key: string]: string[] }, feeling: string) => {
			(acc[feeling] = acc[feeling] || []).push(feeling);
			return acc;
		}, {});
		const countArray = Object.entries(grouped).map(([value, arr]) => ({
			value,
			count: arr.length
		}));
		countArray.sort((a, b) => b.count - a.count);
		return countArray;
	};
	const getNeeds = () => {
		const needs = data.analyses.map((analysis) => {
			return analysis.needs;
		});
		const res = needs.flat();
		const grouped = res.reduce((acc: { [key: string]: string[] }, need: string) => {
			(acc[need] = acc[need] || []).push(need);
			return acc;
		}, {});
		const countArray = Object.entries(grouped).map(([value, arr]) => ({
			value,
			count: arr.length
		}));
		countArray.sort((a, b) => b.count - a.count);
		return countArray;
	};
</script>

<div class="flex flex-col gap-8 pt-4 pb-8">
	<div>
		<HeadingExplanation
			title="Deine Reflektionen im Überblick"
			description="Jedes Gespräch ist ein Schritt zu mehr Klarheit. Entdecke hier deine Entwicklung und gewonnene Einsichten."
		/>
		<StatsChatOverview data={data.analyses} />
	</div>
	<div>
		<HeadingExplanation
			title="Deine häufigsten Gefühle"
			description="Diese Gefühle sind in deinen Reflexionen aufgetaucht. Je öfter du sie benennst, desto bewusster wirst du dir deiner emotionalen Muster."
		/>
		<StatsFeelings data={getFeelings()} rawAnalyses={data.analyses} />
	</div>
	<div>
		<HeadingExplanation
			title="Deine wichtigsten Bedürfnisse"
			description="Diese Bedürfnisse haben sich in deinen Gesprächen gezeigt. Sie zu kennen hilft dir, bewusstere Entscheidungen zu treffen und besser für dich zu sorgen."
		/>
		<StatsNeeds data={getNeeds()} rawAnalyses={data.analyses} />
	</div>
</div>
