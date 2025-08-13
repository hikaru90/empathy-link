<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		placeholder: string;
		value: string;
    class?: string;
		textarea?: HTMLTextAreaElement;
		onEnter?: () => void;
	}

  let textarea: HTMLTextAreaElement;

	let { placeholder = '', value = $bindable(''), class: className = undefined, textarea: textareaBinding = $bindable(), onEnter }: Props = $props();

  let previousValue = $state(value);
  let shouldSetCursorToEnd = $state(false);

  const setCursorToEnd = () => {
        const length = textarea.value.length;
        textarea.focus();
        textarea.setSelectionRange(length, length);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && onEnter) {
      event.preventDefault();
      onEnter();
    }
  };

  $effect(() => {
    // Update the binding
    textareaBinding = textarea;
  });

  $effect(() => {
    // Only set cursor to end if value was changed from outside (not by user typing)
    if (value !== previousValue) {
      shouldSetCursorToEnd = value.length > previousValue.length && 
                            (value.indexOf(previousValue) === 0 || previousValue === '');
      previousValue = value;
    }
    changeHeight();
    if (shouldSetCursorToEnd) {
      setCursorToEnd();
      shouldSetCursorToEnd = false;
    }
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
	onkeydown={handleKeydown}
></textarea>
