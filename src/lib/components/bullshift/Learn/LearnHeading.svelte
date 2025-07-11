<script lang="ts">
	
	interface HeadingContent {
		hierarchy: number;
		content: string;
		subheading?: string;
	}

	interface Props {
		content: HeadingContent;
		isPreview?: boolean;
	}

	let { content, isPreview = false }: Props = $props();

	const headingStyles: Record<
		number,
		{
			tag: string;
			wrapperClass: string;
			headingClass: string;
			subheadingClass: string;
		}
	> = {
		1: {
			tag: 'h1',
			wrapperClass: 'mb-6',
			headingClass: 'mt-10 text-xl font-bold',
			subheadingClass: 'mt-2 text-lg text-gray-600'
		},
		2: {
			tag: 'h2',
			wrapperClass: 'mb-4',
			headingClass: 'mt-8 text-lg font-bold',
			subheadingClass: 'mt-2 text-base text-gray-600'
		},
		3: {
			tag: 'h3',
			wrapperClass: 'mb-3',
			headingClass: 'text-md mt-6 font-bold',
			subheadingClass: 'mt-1 text-sm text-gray-600'
		},
		4: {
			tag: 'h4',
			wrapperClass: 'mb-2',
			headingClass: 'mt-5 text-sm font-bold',
			subheadingClass: 'mt-1 text-sm text-gray-600'
		},
		5: {
			tag: 'h5',
			wrapperClass: 'mb-2',
			headingClass: 'mt-4 text-xs font-bold',
			subheadingClass: 'mt-1 text-xs text-gray-600'
		},
		6: {
			tag: 'h6',
			wrapperClass: 'mb-1',
			headingClass: 'mt-3 text-xs font-bold',
			subheadingClass: 'mt-1 text-xs text-gray-600'
		}
	};

	const currentStyle = $derived(headingStyles[content.hierarchy] || headingStyles[1]);
</script>

<div class={currentStyle.wrapperClass}>
	<svelte:element this={currentStyle.tag} class={currentStyle.headingClass}>
		{content.content}
	</svelte:element>

	{#if content.subheading}
		<p class={currentStyle.subheadingClass}>{content.subheading}</p>
	{/if}
</div>
