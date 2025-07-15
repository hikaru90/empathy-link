<script lang="ts">
  import { marked } from 'marked';
  
	interface Props {
		content: object;
	}

	let { content }: Props = $props();
</script>

<div class="mb-6">
	<div class="prose prose-lg">
		{@html marked(content.content || '')}
	</div>
</div>
