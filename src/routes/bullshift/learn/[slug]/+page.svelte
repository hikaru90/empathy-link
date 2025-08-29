<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import LearnContentRenderer from '$lib/components/bullshift/Learn/LearnContentRenderer.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let currentStep = $state(data.currentStep || 0);
	let currentSession = $state<LearningSession | null>(null);

	// Handle step changes from the content renderer
	const handleStepChange = (step: number) => {
		currentStep = step;
	};

	// Handle session changes from the content renderer
	const handleSessionChange = (session: LearningSession | null) => {
		currentSession = session;
	};
</script>

<div class="pb-[82px] pt-6 h-svh overflow-hidden">
	<Header class="z-20" user={data.user} />
	<div class="max-container py-10 w-full h-full">
		<!-- Use centralized content renderer -->
		<LearnContentRenderer 
			record={data.record}
			categories={data.categories || []}
			user={data.user}
			initialStep={currentStep}
			isPreview={false}
			onStepChange={handleStepChange}
			onSessionChange={handleSessionChange}
		/>
		
	</div>
	<Footer user={data.user} />
</div>
