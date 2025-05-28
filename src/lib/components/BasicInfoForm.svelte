<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import ImagePreview from '$lib/components/ImagePreview.svelte';
	import type { TopicVersion } from '$routes/bullshift/learn/[id]/edit/schema';
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

	interface Props {
		form: any; // SuperForm instance
		formData: any; // Reactive form store
		currentVersion?: TopicVersion;
	}

	let { form, formData, currentVersion }: Props = $props();
	
	const handleImageChange = (filename: string) => {
		$formData.image = filename;
	};
</script>


<Collapsible.Root class="bg-white/80 rounded-md">
	<div class="flex items-center justify-between space-x-4">
		{#snippet trigger({ builder })}
			<Collapsible.Trigger asChild class="w-full">
				<Button builders={[builder]} variant="ghost" class="p-0 w-full flex items-center justify-between px-3 py-4 h-auto hover:bg-transparent">
					<h4 class="font-bold">Allgemeine Einstellungen</h4>
					<div>
						<ChevronsUpDown class="h-4 w-4 text-black/30" />
						<span class="sr-only">Toggle</span>
					</div>
				</Button>
			</Collapsible.Trigger>
		{/snippet}
		{@render trigger({ builder: (el) => el })}
	</div>
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
		
		</div> 
  </Collapsible.Content>
</Collapsible.Root>