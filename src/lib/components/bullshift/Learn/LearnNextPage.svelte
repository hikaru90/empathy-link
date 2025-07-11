<script lang="ts">
	import NextPageButton from './NextPageButton.svelte';

	interface Props {
		content: {
			text?: string;
			variant?: 'default' | 'minimal' | 'floating' | 'large';
			disabled?: boolean;
			customAction?: string;
		};
		isPreview?: boolean;
	}

	let { content, isPreview = false }: Props = $props();
</script>

<div class="mb-4">
	<NextPageButton 
		text={content.text || 'Next'}
		variant={content.variant || 'default'}
		disabled={content.disabled || false}
		{isPreview}
	/>
</div>