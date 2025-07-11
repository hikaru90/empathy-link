<script lang="ts">
  import { marked } from 'marked';
  
	interface Props {
		content: object;
		isPreview?: boolean;
	}

	let { content, isPreview = false }: Props = $props();
</script>

<div class="mb-6">
	<div class="prose prose-lg">
		{@html marked(content.content || '')}
	</div>
</div>
