<script lang="ts">
	import NextPageButton from './NextPageButton.svelte';

	interface Props {
		content: {
			text?: string;
			variant?: 'default' | 'minimal' | 'floating' | 'large';
			disabled?: boolean;
			customAction?: string;
		};
	}

	let { content }: Props = $props();
</script>

<div class="mb-4">
	<NextPageButton 
		text={content.text || 'Next'}
		disabled={content.disabled || false}
	/>
</div>