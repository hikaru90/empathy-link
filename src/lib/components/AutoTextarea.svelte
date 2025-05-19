<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		placeholder: string;
		value: string;
    class?: string;
	}

  let textarea: HTMLTextAreaElement;

	let { placeholder = '', value = $bindable(''), class: className = undefined }: Props = $props();

  const setCursorToEnd = () => {
        const length = textarea.value.length;
        textarea.focus();
        textarea.setSelectionRange(length, length);
  };

  $effect(() => {
    value = value;
    changeHeight()
    setCursorToEnd();
  });

	const changeHeight = () => {
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	};
</script>

<textarea style="resize: none;"
	bind:value
	{placeholder}
  bind:this={textarea}
  rows=1
	class={cn('overflow-y-auto max-h-[6.6em] overscroll-contain', className)}
></textarea>
