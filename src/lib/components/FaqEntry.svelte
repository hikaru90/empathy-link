<script lang="ts">
	import { m } from '$lib/translations';
	import { getLocale } from '$src/paraglide/runtime';
	import { checkVisibility } from '$lib/actions';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Plus from 'lucide-svelte/icons/plus';
	import { marked } from 'marked';

	const { faq, index } = $props();

	let isOpen = $state(false);

	const toggle = () => {
		isOpen = !isOpen;
	};
</script>

<div class="rounded-lg border border-white bg-white/90">
	<button onclick={toggle} class="flex w-full items-center justify-between p-4">
		<h3 class="font-bold">{faq.question}</h3>
		<Plus class="size-5 transform transition-transform duration-300 {isOpen ? 'rotate-45' : ''}" />
	</button>
	<div class="transition-all duration-300 {isOpen ? 'max-h-[1000px]' : 'max-h-0 overflow-hidden'}">
		<div class="text-neutral-800 p-4">
			{@html marked(faq.answer)}
		</div>
	</div>
</div>
