<script lang="ts">
  import { marked } from 'marked';
  
	interface Props {
		content: object;
	}

	let { content }: Props = $props();
</script>

<div class="mb-4">
  {@html marked(content.content)}
</div>
