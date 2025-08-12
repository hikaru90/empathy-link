<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { pb } from '$scripts/pocketbase';
	import { AlertCircle, CheckCircle, Upload, X } from 'lucide-svelte/icons';

	interface Props {
		onSubmit?: () => void;
		onCancel?: () => void;
		showCancelButton?: boolean;
	}

	let { onSubmit, onCancel, showCancelButton = false }: Props = $props();

	let isSubmitting = $state(false);
	let isSuccess = $state(false);
	let error = $state<string | null>(null);

	// Form data
	let description = $state('');
	let expectedBehavior = $state('');
	let actualBehavior = $state('');
	let reproducableSteps = $state('');
	let screenshots = $state<File[]>([]);

	// File handling
	let dragActive = $state(false);

	function handleDrag(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			dragActive = true;
		} else if (e.type === 'dragleave') {
			dragActive = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		dragActive = false;

		if (e.dataTransfer?.files) {
			const newFiles = Array.from(e.dataTransfer.files);
			addFiles(newFiles);
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			const newFiles = Array.from(target.files);
			addFiles(newFiles);
		}
	}

	function addFiles(newFiles: File[]) {
		// Filter for image files only
		const imageFiles = newFiles.filter(file => 
			file.type.startsWith('image/') || 
			['png', 'jpg', 'jpeg', 'gif', 'webp'].some(ext => 
				file.name.toLowerCase().endsWith(ext)
			)
		);

		if (imageFiles.length !== newFiles.length) {
			error = 'Some files were not images and were skipped. Only PNG, JPG, GIF, and WebP files are supported.';
			setTimeout(() => { error = null; }, 5000);
		}

		screenshots = [...screenshots, ...imageFiles];
	}

	function removeFile(index: number) {
		screenshots = screenshots.filter((_, i) => i !== index);
	}

	function clearFiles() {
		screenshots = [];
	}

	async function submitFeedback() {
		if (!description.trim() || !expectedBehavior.trim() || !actualBehavior.trim() || !reproducableSteps.trim()) {
			error = 'Please fill in all required fields.';
			return;
		}

		isSubmitting = true;
		error = null;

		try {
			const feedbackData: any = {
				description: description.trim(),
				expectedBehavior: expectedBehavior.trim(),
				actualBehavior: actualBehavior.trim(),
				reproducableSteps: reproducableSteps.trim()
			};

			// Handle file uploads if there are any
			if (screenshots.length > 0) {
				const formData = new FormData();
				formData.append('description', description.trim());
				formData.append('expectedBehavior', expectedBehavior.trim());
				formData.append('actualBehavior', actualBehavior.trim());
				formData.append('reproducableSteps', reproducableSteps.trim());
				
				screenshots.forEach((file, index) => {
					formData.append(`screenshots`, file);
				});

				// Use FormData for file upload
				const response = await pb.collection('feedback').create(formData);
				console.log('Feedback submitted with files:', response);
			} else {
				// No files, use regular JSON
				const response = await pb.collection('feedback').create(feedbackData);
				console.log('Feedback submitted:', response);
			}

			isSuccess = true;
			
			// Reset form
			description = '';
			expectedBehavior = '';
			actualBehavior = '';
			reproducableSteps = '';
			screenshots = [];

			// Call onSubmit callback if provided
			if (onSubmit) {
				onSubmit();
			}

			// Auto-hide success message after 3 seconds
			setTimeout(() => {
				isSuccess = false;
			}, 3000);

		} catch (err: any) {
			console.error('Error submitting feedback:', err);
			error = err.message || 'Failed to submit feedback. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	function handleCancel() {
		if (onCancel) {
			onCancel();
		}
	}
</script>

<Card class="w-full max-w-2xl mx-auto">
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<AlertCircle class="h-5 w-5 text-orange-500" />
			Report a Bug
		</CardTitle>
	</CardHeader>
	<CardContent class="space-y-6">
		<!-- Success Message -->
		{#if isSuccess}
			<div class="rounded-lg border border-green-200 bg-green-50 p-4">
				<div class="flex items-center">
					<CheckCircle class="mr-2 h-5 w-5 text-green-600" />
					<span class="font-medium text-green-800">Thank you for your feedback!</span>
				</div>
				<div class="mt-1 text-sm text-green-700">
					Your bug report has been submitted successfully. We'll review it and get back to you if needed.
				</div>
			</div>
		{/if}

		<!-- Error Message -->
		{#if error}
			<div class="rounded-lg border border-red-200 bg-red-50 p-4">
				<div class="flex items-center">
					<AlertCircle class="mr-2 h-5 w-5 text-red-600" />
					<span class="font-medium text-red-800">Error</span>
				</div>
				<div class="mt-1 text-sm text-red-700">{error}</div>
			</div>
		{/if}

		<form on:submit|preventDefault={submitFeedback} class="space-y-4">
			<!-- Description -->
			<div class="space-y-2">
				<Label for="description" class="text-sm font-medium">
					Description <span class="text-red-500">*</span>
				</Label>
				<Textarea
					id="description"
					bind:value={description}
					placeholder="Describe the bug you encountered..."
					rows={3}
					required
					class="resize-none"
				/>
			</div>

			<!-- Expected Behavior -->
			<div class="space-y-2">
				<Label for="expectedBehavior" class="text-sm font-medium">
					Expected Behavior <span class="text-red-500">*</span>
				</Label>
				<Textarea
					id="expectedBehavior"
					bind:value={expectedBehavior}
					placeholder="What should have happened?"
					rows={2}
					required
					class="resize-none"
				/>
			</div>

			<!-- Actual Behavior -->
			<div class="space-y-2">
				<Label for="actualBehavior" class="text-sm font-medium">
					Actual Behavior <span class="text-red-500">*</span>
				</Label>
				<Textarea
					id="actualBehavior"
					bind:value={actualBehavior}
					placeholder="What actually happened instead?"
					rows={2}
					required
					class="resize-none"
				/>
			</div>

			<!-- Reproducible Steps -->
			<div class="space-y-2">
				<Label for="reproducableSteps" class="text-sm font-medium">
					Steps to Reproduce <span class="text-red-500">*</span>
				</Label>
				<Textarea
					id="reproducableSteps"
					bind:value={reproducableSteps}
					placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
					rows={4}
					required
					class="resize-none"
				/>
			</div>

			<!-- Screenshots -->
			<div class="space-y-2">
				<Label class="text-sm font-medium">Screenshots (Optional)</Label>
				<div
					class="relative border-2 border-dashed rounded-lg p-6 text-center transition-colors"
					class:border-blue-400={dragActive}
					class:border-gray-300={!dragActive}
					class:bg-blue-50={dragActive}
					class:bg-gray-50={!dragActive}
					on:dragenter={handleDrag}
					on:dragover={handleDrag}
					on:dragleave={handleDrag}
					on:drop={handleDrop}
				>
					<Upload class="mx-auto h-8 w-8 text-gray-400 mb-2" />
					<p class="text-sm text-gray-600 mb-2">
						Drag and drop screenshots here, or
					</p>
					<label for="file-upload" class="cursor-pointer">
						<Button type="button" variant="outline" size="sm">
							Choose Files
						</Button>
					</label>
					<input
						id="file-upload"
						type="file"
						multiple
						accept="image/*"
						on:change={handleFileSelect}
						class="hidden"
					/>
					<p class="text-xs text-gray-500 mt-2">
						PNG, JPG, GIF, WebP up to 10MB each
					</p>
				</div>

				<!-- File List -->
				{#if screenshots.length > 0}
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium">Selected Files ({screenshots.length})</span>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onclick={clearFiles}
								class="text-red-600 hover:text-red-700 hover:bg-red-50"
							>
								Clear All
							</Button>
						</div>
						<div class="space-y-2">
							{#each screenshots as file, index}
								<div class="flex items-center justify-between p-2 bg-gray-50 rounded border">
									<div class="flex items-center space-x-2">
										<span class="text-sm text-gray-600">{file.name}</span>
										<span class="text-xs text-gray-400">
											({(file.size / 1024 / 1024).toFixed(2)} MB)
										</span>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onclick={() => removeFile(index)}
										class="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
									>
										<X class="h-4 w-4" />
									</Button>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Submit Buttons -->
			<div class="flex gap-3 pt-4">
				<Button
					type="submit"
					disabled={isSubmitting}
					class="flex-1"
				>
					{#if isSubmitting}
						Submitting...
					{:else}
						Submit Bug Report
					{/if}
				</Button>
				
				{#if showCancelButton}
					<Button
						type="button"
						variant="outline"
						onclick={handleCancel}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
				{/if}
			</div>
		</form>
	</CardContent>
</Card>
