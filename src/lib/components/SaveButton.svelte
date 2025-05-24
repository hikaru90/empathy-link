<script lang="ts">
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import Check from 'lucide-svelte/icons/check';
	import Save from 'lucide-svelte/icons/save';
	import SaveOff from 'lucide-svelte/icons/save-off';
	import X from 'lucide-svelte/icons/x';

	interface Props {
		saveStatus: 'idle' | 'saving' | 'success' | 'error';
		disabled?: boolean;
		onclick?: () => void;
	}

	let { saveStatus, disabled = false, onclick }: Props = $props();
</script>

<button
	type="submit"
	disabled={saveStatus === 'saving' || disabled}
	{onclick}
	style="border: 2px solid rgba(214, 214, 219, 0.3); box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.3), -4px -4px 8px 0 rgba(255, 255, 255, 0.3);"
	class="flex text-sm items-center gap-2 rounded-full px-4 py-1 {saveStatus ===
	'saving'
		? 'cursor-not-allowed text-gray-300'
		: saveStatus === 'success'
			? 'bg-green-500'
			: saveStatus === 'error'
				? 'bg-red-500'
				: 'bg-background hover:bg-black/20'}"
>
	{#if saveStatus === 'saving'}
		<Loader2 class="h-4 w-4 animate-spin" />
		Speichert
	{:else if saveStatus === 'success'}
		<Check class="h-4 w-4" />
		Gespeichert
	{:else if saveStatus === 'error'}
	<SaveOff class="h-4 w-4 text-red-500" />
		Fehler
	{:else}
	Speichern
	<Save class="h-4 w-4 text-black/60" />
	{/if}
</button> 