<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		placeholder: string;
		value: string;
    class?: string;
	}

  let textarea: HTMLTextAreaElement;

	let { placeholder = '', value = $bindable(''), class: className = undefined }: Props = $props();

  $effect(() => {
    console.log('value', value);
    changeHeight()
  });

	const changeHeight = () => {
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	};
</script>

<textarea
	bind:value
	{placeholder}
  bind:this={textarea}
  rows=1
	class={cn('overflow-hidden max-h-[4.6em]', className)}
></textarea>
