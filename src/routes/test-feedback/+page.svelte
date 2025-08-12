<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import FeedbackModal from '$lib/components/FeedbackModal.svelte';

	let showFeedbackModal = $state(false);

	function openFeedbackModal() {
		showFeedbackModal = true;
	}

	function closeFeedbackModal() {
		showFeedbackModal = false;
	}

	function handleFeedbackSubmit() {
		console.log('Feedback submitted successfully!');
		// The modal will auto-close after showing success message
	}
</script>

<svelte:head>
	<title>Test Feedback Modal - Empathy-Link</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="container mx-auto max-w-2xl">
		<h1 class="text-3xl font-bold text-gray-900 mb-8">Test Feedback Modal</h1>
		
		<div class="space-y-4">
			<p class="text-gray-600">
				Click the button below to test the feedback modal component.
			</p>
			
			<Button onclick={openFeedbackModal}>
				Report a Bug
			</Button>

			<div class="bg-white rounded-lg p-6 shadow-sm border">
				<h2 class="text-lg font-medium mb-4">Usage Example</h2>
				<pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto"><code>{`<script>
	import FeedbackModal from '$lib/components/FeedbackModal.svelte';
	
	let showFeedbackModal = $state(false);
	
	function openFeedbackModal() {
		showFeedbackModal = true;
	}
	
	function closeFeedbackModal() {
		showFeedbackModal = false;
	}
	
	function handleFeedbackSubmit() {
		console.log('Feedback submitted!');
	}
</script>

<Button onclick={openFeedbackModal}>Report a Bug</Button>

<FeedbackModal 
	isOpen={showFeedbackModal}
	on:close={closeFeedbackModal}
	on:submit={handleFeedbackSubmit}
/>`}</code></pre>
			</div>

			<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h3 class="font-medium text-blue-900 mb-2">Features:</h3>
				<ul class="text-sm text-blue-800 space-y-1">
					<li>✅ Fullscreen modal overlay</li>
					<li>✅ Closable with X button, Escape key, or backdrop click</li>
					<li>✅ Complete feedback form with file upload</li>
					<li>✅ Responsive design</li>
					<li>✅ Event dispatching for close and submit actions</li>
					<li>✅ Auto-close after successful submission</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<FeedbackModal 
	isOpen={showFeedbackModal}
	on:close={closeFeedbackModal}
	on:submit={handleFeedbackSubmit}
/>