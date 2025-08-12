<script lang="ts">
	import FeedbackForm from '$lib/components/FeedbackForm.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { ArrowLeft } from 'lucide-svelte/icons';
	import { goto } from '$app/navigation';

	let showForm = $state(true);

	function handleSubmit() {
		console.log('Feedback submitted successfully!');
		// You can add additional logic here, like showing a success page
	}

	function handleCancel() {
		showForm = false;
	}

	function goBack() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Report a Bug - Empathy-Link</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="container mx-auto px-4">
		<!-- Header -->
		<div class="mb-8">
			<Button variant="ghost" onclick={goBack} class="mb-4">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back
			</Button>
			<h1 class="text-3xl font-bold text-gray-900">Bug Report & Feedback</h1>
			<p class="mt-2 text-gray-600">
				Help us improve Empathy-Link by reporting bugs or issues you encounter.
			</p>
		</div>

		{#if showForm}
			<FeedbackForm 
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				showCancelButton={true}
			/>
		{:else}
			<Card class="w-full max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>Thank You!</CardTitle>
				</CardHeader>
				<CardContent class="text-center py-8">
					<p class="text-gray-600 mb-4">
						Your feedback helps us make Empathy-Link better for everyone.
					</p>
					<Button onclick={() => showForm = true}>
						Submit Another Report
					</Button>
				</CardContent>
			</Card>
		{/if}

		<!-- Help Section -->
		<Card class="w-full max-w-2xl mx-auto mt-8">
			<CardHeader>
				<CardTitle>How to Write a Good Bug Report</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="space-y-2">
					<h4 class="font-medium">Be Specific</h4>
					<p class="text-sm text-gray-600">
						Describe exactly what happened and what you expected to happen.
					</p>
				</div>
				<div class="space-y-2">
					<h4 class="font-medium">Include Steps</h4>
					<p class="text-sm text-gray-600">
						Provide step-by-step instructions to reproduce the issue.
					</p>
				</div>
				<div class="space-y-2">
					<h4 class="font-medium">Add Screenshots</h4>
					<p class="text-sm text-gray-600">
						Visual evidence helps us understand the problem better.
					</p>
				</div>
				<div class="space-y-2">
					<h4 class="font-medium">Environment Details</h4>
					<p class="text-sm text-gray-600">
						Mention your browser, device, and any relevant context.
					</p>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
