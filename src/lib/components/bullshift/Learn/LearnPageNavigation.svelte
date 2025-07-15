<script lang="ts">
	import PageNavigation from './PageNavigation.svelte';

	interface Props {
		content: {
			showNext?: boolean;
			showPrev?: boolean;
			nextText?: string;
			prevText?: string;
			variant?: 'default' | 'minimal' | 'floating' | 'inline';
			nextDisabled?: boolean;
			prevDisabled?: boolean;
		};
	}

	let { content }: Props = $props();
</script>

<div class="mb-4">
	<PageNavigation 
		showNext={content.showNext !== false}
		showPrev={content.showPrev || false}
		nextText={content.nextText || 'Next'}
		prevText={content.prevText || 'Previous'}
		variant={content.variant || 'default'}
		nextDisabled={content.nextDisabled || false}
		prevDisabled={content.prevDisabled || false}
	/>
</div>