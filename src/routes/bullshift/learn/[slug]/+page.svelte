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

	let currentPage = $state(data.currentPage || 0);
	let currentSession = $state<LearningSession | null>(null);

	// Handle page changes from the content renderer
	const handlePageChange = (page: number) => {
		currentPage = page;
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
			initialPage={currentPage}
			isPreview={false}
			onPageChange={handlePageChange}
			onSessionChange={handleSessionChange}
		/>
		
	</div>
	<Footer />
</div>
