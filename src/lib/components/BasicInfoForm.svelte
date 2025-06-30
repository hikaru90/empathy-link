<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import ImagePreview from '$lib/components/ImagePreview.svelte';
	import type { TopicVersion } from '$routes/bullshift/learn/[slug]/edit/schema';
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import { Button } from '$lib/components/ui/button';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	interface Props {
		form: any; // SuperForm instance
		formData: any; // Reactive form store
		currentVersion?: TopicVersion;
		onDeleteVersion?: (versionId: string) => void;
		canDelete?: boolean;
	}

	let { form, formData, currentVersion, onDeleteVersion, canDelete = false }: Props = $props();
	
	const handleImageChange = (filename: string) => {
		$formData.image = filename;
	};
</script>


<Collapsible.Root class="bg-white/80 rounded-md">
	<Collapsible.Trigger class="w-full flex items-center justify-between px-3 py-4 h-auto">
		<h4 class="font-bold">Allgemeine Einstellungen</h4>
		<div>
			<ChevronsUpDown class="h-4 w-4 text-black/30" />
			<span class="sr-only">Toggle</span>
		</div>
	</Collapsible.Trigger>
  <Collapsible.Content class="space-y-2 p-3">
    <div class="space-y-4">
			<Form.Field {form} name="titleDE">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>German Title</Form.Label>
						<Input {...attrs} bind:value={$formData.titleDE} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		
			<Form.Field {form} name="titleEN">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>English Title</Form.Label>
						<Input {...attrs} bind:value={$formData.titleEN} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		
			<Form.Field {form} name="descriptionDE">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>German Description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.descriptionDE} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		
			<Form.Field {form} name="descriptionEN">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>English Description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.descriptionEN} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		
			<Form.Field {form} name="category">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Category</Form.Label>
						<Input {...attrs} bind:value={$formData.category} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		
			<Form.Field {form} name="image">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Image URL</Form.Label>
						<ImagePreview imageUrl={$formData.image} {currentVersion} onImageChange={handleImageChange} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Delete Version Section -->
			{#if canDelete && currentVersion && onDeleteVersion}
				<div class="pt-4 border-t border-gray-200">
					<div class="space-y-2">
						<h5 class="text-sm font-medium text-gray-700">Danger Zone</h5>
						<p class="text-xs text-gray-500">
							Delete this version permanently. This action cannot be undone.
						</p>
						<Button 
							type="button"
							variant="destructive"
							size="sm"
							class="w-full"
							onclick={() => {
								if (currentVersion && onDeleteVersion) {
									if (confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
										onDeleteVersion(currentVersion.id);
									}
								}
							}}
						>
							<Trash2 class="w-4 h-4 mr-2" />
							Delete Version
						</Button>
					</div>
				</div>
			{/if}
		
		</div> 
  </Collapsible.Content>
</Collapsible.Root>