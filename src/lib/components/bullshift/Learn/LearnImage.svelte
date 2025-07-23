<script lang="ts">
  import type { ImageBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
  import { getMediaUrl } from '$scripts/helpers';
  import { pb } from '$scripts/pocketbase';
  import { getContext } from 'svelte';
  import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
  
  interface Props {
    content: ImageBlock;
    currentVersion?: any;
    gotoNextStep?: () => void;
  }

  let { content, currentVersion, gotoNextStep }: Props = $props();
  
  // Try to get the current version from context if not provided
  const contextVersion = getContext('currentVersion');
  const version = currentVersion || contextVersion;

  const getImageUrl = (src: string) => {
    // If it's already a full URL, return as is
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    
    // If no version information available, return the src as is
    if (!version?.id) {
      return src;
    }
    
    // If it's already a PocketBase URL, return as is
    if (src.includes('/api/files/')) {
      return src;
    }
    
    // Construct PocketBase media URL
    return getMediaUrl('topicVersions', version.id, src, pb.baseUrl);
  };
</script>

<div class="flex flex-col justify-between items-center w-full h-full">
  <div class="flex flex-col flex-grow justify-center items-center w-full">
    <img 
    src={getImageUrl(content.src || '')}
    alt={content.alt || ''}
    class="w-full h-auto"
    loading="lazy"
    onerror={(e) => {
      console.error('Failed to load image:', content.src, 'Resolved URL:', getImageUrl(content.src || ''));
      const target = e.target as HTMLImageElement;
      if (target) {
        target.style.display = 'none';
      }
    }}
    />
    {#if content.caption}
    <div class="mt-2 text-sm text-gray-600 italic">
      {content.caption}
    </div>
    {/if}
  </div>
  <LearnGotoNextButton
			onClick={() => {
				gotoNextStep?.();
			}}
		>
			Weiter
		</LearnGotoNextButton>
</div> 