<script lang="ts">
  import type { ImageBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
  
  interface Props {
    content: ImageBlock;
  }

  let { content }: Props = $props();

  const getAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center':
      default: return 'text-center';
    }
  };

  const getImageStyle = () => {
    let style = '';
    if (content.width) {
      style += `max-width: ${content.width}px; `;
    }
    return style;
  };
</script>

<div class="mb-6 {getAlignmentClass(content.alignment)}">
  <div class="inline-block">
    <img 
      src={content.src}
      alt={content.alt || ''}
      style={getImageStyle()}
      class="max-w-full h-auto rounded-lg shadow-sm"
      loading="lazy"
    />
    {#if content.caption}
      <div class="mt-2 text-sm text-gray-600 italic">
        {content.caption}
      </div>
    {/if}
  </div>
</div> 