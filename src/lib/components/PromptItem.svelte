<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { DbPrompt } from '$lib/server/prompts';
	import FilePenLine from 'lucide-svelte/icons/file-pen-line';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import Copy from 'lucide-svelte/icons/copy';
	import RefreshCw from 'lucide-svelte/icons/refresh-cw';
	import { marked } from 'marked';

	interface Props {
		prompt: DbPrompt;
	}

	let { prompt }: Props = $props();
	let isEditing = $state(false);
	let showPreview = $state(false);
	let pathConfigJson = $state('');
	let renderedContent = $state('');
	let pathConfigError = $state<string | null>(null);
	let copiedShortcode = $state<string | null>(null);

	// Available shortcodes
	const availableShortcodes = [
		{
			code: 'answerLengthPreference',
			description: 'Dynamic length rules based on user preference'
		},
		{ code: 'toneOfVoicePreference', description: 'Dynamic tone rules based on user preference' },
		{
			code: 'nvcKnowledgePreference',
			description: 'Dynamic NVC complexity rules based on user preference'
		},
		{ code: 'importantRules', description: 'Core conversation rules (no emojis, no bold, etc.)' }
	];

	// Function to extract shortcodes from content
	function extractShortcodes(content: string): string[] {
		if (!content) return [];
		const shortcodeRegex = /\[([a-z0-9_-]+)\]/gi;
		const matches = [...content.matchAll(shortcodeRegex)];
		return [...new Set(matches.map((match) => match[1]))]; // Remove duplicates
	}

	// Get shortcodes used in this prompt
	const usedShortcodes = $derived(extractShortcodes(prompt.content));

	// Configure marked for safe HTML output
	marked.setOptions({
		breaks: true,
		gfm: true
	});

	// Reactive statement to update rendered content when prompt.content changes
	$effect(() => {
		if (prompt.content) {
			markdownToHtml(prompt.content).then((html) => {
				renderedContent = html;
			});
		} else {
			renderedContent = '';
		}
	});

	async function markdownToHtml(markdown: string): Promise<string> {
		if (!markdown) return '';
		return await marked(markdown);
	}

	function startEdit() {
		isEditing = true;
		// Convert path_config object to JSON string, handling both object and string cases
		if (prompt.path_config) {
			if (typeof prompt.path_config === 'string') {
				pathConfigJson = prompt.path_config;
			} else {
				pathConfigJson = JSON.stringify(prompt.path_config, null, 2);
			}
		} else {
			pathConfigJson = '';
		}
		validatePathConfig();
	}

	function cancelEdit() {
		isEditing = false;
		pathConfigJson = '';
		pathConfigError = null;
	}

	function validatePathConfig() {
		if (!pathConfigJson.trim()) {
			pathConfigError = null;
			return;
		}

		try {
			// Try to parse as JSON
			JSON.parse(pathConfigJson);
			pathConfigError = null;
		} catch (error) {
			pathConfigError = 'Invalid JSON format';
		}
	}

	function handlePathConfigInput() {
		validatePathConfig();
	}

	async function copyShortcode(shortcode: string) {
		try {
			await navigator.clipboard.writeText(`[${shortcode}]`);
			copiedShortcode = shortcode;
			setTimeout(() => {
				copiedShortcode = null;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy shortcode:', error);
		}
	}

	function convertToJson() {
		if (!pathConfigJson.trim()) return;

		try {
			// First try to parse as JSON to see if it's already valid
			JSON.parse(pathConfigJson);
			// If it's already valid JSON, just format it
			pathConfigJson = JSON.stringify(JSON.parse(pathConfigJson), null, 2);
		} catch (parseError) {
			// If JSON parsing fails, try to evaluate as JavaScript object
			try {
				// Remove any trailing commas and ensure it's a valid object
				const cleanedStr = pathConfigJson.replace(/,(\s*[}\]])/g, '$1');
				const evaluated = eval(`(${cleanedStr})`);
				if (typeof evaluated === 'object' && evaluated !== null) {
					// Convert to properly formatted JSON
					pathConfigJson = JSON.stringify(evaluated, null, 2);
					pathConfigError = null;
				} else {
					pathConfigError = 'Input is not a valid object';
				}
			} catch (evalError) {
				pathConfigError = 'Invalid JavaScript object format';
			}
		}
	}

	async function handleFormSuccess() {
		isEditing = false;
		pathConfigJson = '';
		pathConfigError = null;
		showPreview = false;
		await invalidateAll();
	}
</script>

{#if isEditing}
	<!-- Edit Form -->
	<div class="mb-4 rounded-lg border bg-white p-4 shadow-sm">
		<h2 class="mb-4 font-bold">{prompt.name} bearbeiten</h2>
		<form
			method="POST"
			action="?/update"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						handleFormSuccess();
					}
				};
			}}
		>
			<input type="hidden" name="id" value={prompt.id} />
			<input type="hidden" name="slug" value={prompt.slug} />
			<input type="hidden" name="name" value={prompt.name} />
			<input type="hidden" name="category" value={prompt.category} />
			<div class="flex flex-col gap-2">
				<div>
					<span class="">Slug:</span>
					{prompt.slug}
				</div>
				<div>
					<span class="">Name:</span>
					{prompt.name}
				</div>
				<div>
					<span class="">Category:</span>
					{prompt.category}
				</div>
				<div>
					<span class="">Description:</span>
					<input
						type="text"
						name="description"
						bind:value={prompt.description}
						class="w-full rounded-md border border-gray-300 px-3 py-2"
						placeholder="Enter description..."
					/>
				</div>
			</div>
			<div class="mb-4">
				<div class="mb-2 flex items-center justify-between">
					<label class="block text-sm font-medium text-gray-700">Content (Markdown)</label>
					<button
						type="button"
						class="text-sm text-blue-600 hover:text-blue-800"
						onclick={() => (showPreview = !showPreview)}
					>
						{showPreview ? 'Edit' : 'Preview'}
					</button>
				</div>

				<!-- Shortcode Buttons -->
				<div class="mb-3">
					<p class="mb-2 text-xs font-medium text-gray-600">Available Shortcodes:</p>
					<div class="flex flex-wrap gap-2">
						{#each availableShortcodes as shortcode}
							<button
								type="button"
								class="flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
								onclick={() => copyShortcode(shortcode.code)}
								title={shortcode.description}
							>
								<Copy class="h-3 w-3" />
								[{shortcode.code}]
								{#if copiedShortcode === shortcode.code}
									<span class="text-green-600">✓</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
				{#if showPreview}
					<div
						class="max-h-[400px] min-h-[300px] overflow-y-auto rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
					>
						<div class="prose prose-sm max-w-none">
							{@html renderedContent}
						</div>
					</div>
				{:else}
					<textarea
						name="content"
						bind:value={prompt.content}
						rows="15"
						class="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
						placeholder="Enter markdown content here..."
						required
					></textarea>
				{/if}
				<div class="mt-1 text-xs text-gray-500">
					Supports: **bold**, *italic*, `code`, ```code blocks```, # headers, * lists, tables,
					links, and more
				</div>
			</div>
			<div class="mb-4 flex items-center gap-6">
				<label class="flex items-center">
					<input type="checkbox" name="recurring" bind:checked={prompt.recurring} class="mr-2" />
					Recurring (can be used as shortcode)
				</label>
				<label class="flex items-center">
					<input type="checkbox" name="active" bind:checked={prompt.active} class="mr-2" />
					Active
				</label>
			</div>
			{#if prompt.category === 'path'}
				<div class="mb-4">
					<label class="mb-1 block text-sm font-medium text-gray-700">Path Config (JSON)</label>
					<div class="mb-2 flex items-center gap-2">
						<button
							type="button"
							class="flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
							onclick={convertToJson}
							title="Convert JavaScript object to valid JSON"
						>
							<RefreshCw class="h-3 w-3" />
							Convert to JSON
						</button>
					</div>
					<div class="relative">
						<textarea
							name="path_config"
							bind:value={pathConfigJson}
							oninput={handlePathConfigInput}
							rows="5"
							class="w-full rounded-md border border-gray-300 px-3 py-2 pr-8 font-mono text-sm"
							placeholder="Enter JavaScript object or JSON..."
						></textarea>
						{#if pathConfigJson.trim()}
							<div class="absolute right-2 top-2">
								{#if pathConfigError}
									<X class="h-4 w-4 text-red-500" />
								{:else}
									<Check class="h-4 w-4 text-green-500" />
								{/if}
							</div>
						{/if}
					</div>
					{#if pathConfigError}
						<p class="mt-1 text-xs text-red-500">{pathConfigError}</p>
					{/if}
					<p class="mt-1 text-xs text-gray-500">Enter a JavaScript object or valid JSON</p>
				</div>
			{/if}
			<div class="flex gap-2">
				<button type="submit" class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
					Update Prompt
				</button>
				<button
					type="button"
					class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
					onclick={cancelEdit}
				>
					Cancel
				</button>
			</div>
		</form>
	</div>
{:else}
	<!-- Prompt Display -->
	<button
		onclick={startEdit}
		class="group relative bg-offwhite cursor-pointer rounded-lg border border-white/20 p-4 text-left w-full {prompt.active
			? ''
			: ''}"
	>
		<div class="mb-2 flex items-start justify-between">
			<div class="w-full">
				<div class="flex flex-col md:flex-row md:items-center justify-between">
					<h3 class="">
						<span class="font-bold">
							{prompt.name}
						</span>
						<span class="text-sm text-gray-500">({prompt.slug})</span>
					</h3>
					<div class="md:flex md:flex-col text-xs text-gray-500 leading-tight">
						<span class="">
							Created: {new Date(prompt.created).toLocaleString()}
						</span>
						<span class="">
							Updated: {new Date(prompt.updated).toLocaleString()}
						</span>
					</div>
				</div>
				{#if prompt.description}
					<p class="mt-1 text-xs text-gray-600">{prompt.description}</p>
				{/if}

				<!-- Used Shortcodes Display -->
				{#if usedShortcodes.length > 0}
					<div class="mt-2">
						<div class="flex flex-wrap gap-1">
							{#each usedShortcodes as shortcode}
								<span
									class="inline-flex items-center rounded-full bg-forest/30 px-2 py-0.5 text-xs text-forest"
								>
									{shortcode}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			<div class="flex items-center gap-2">
				{#if prompt.recurring}
					<span class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">Recurring</span>
				{/if}
				{#if !prompt.active}
					<span class="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">Inactive</span>
				{/if}
			</div>
		</div>
		
		<div class="mb-3 max-h-32 overflow-y-hidden rounded bg-gray-50 p-3 text-sm">
			<div class="prose prose-sm max-w-none">
				{@html renderedContent}
			</div>
		</div>
		<div
			class="absolute left-0 top-0 flex h-full w-full items-center gap-2 bg-lilac/40 opacity-0 transition-opacity group-hover:opacity-100"
		>
			<div class="flex items-center gap-2 bg-forest rounded-full px-4 py-2 absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 text-white">
				<FilePenLine class="size-4" />
				Edit
			</div>
		</div>
	</button>
{/if}
