<script lang="ts">
  import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
  import { PUBLIC_BACKEND_URL } from '$env/static/public'

  import type { PageData } from './$types';
  
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

console.log('category', data.categories.find(category => category.id === '66810rsh06w73ea'));

  const categories = $derived(() => {
    if(!data.topics) return []
    const res = data.topics
    // Group topics by category
    const groupedTopics = res.reduce((acc: Record<string, any[]>, topic: any) => {
      const category = topic.expand?.category?.id || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(topic);
      return acc;
    }, {});

    // Convert to array of category groups
    const groupedArray = Object.entries(groupedTopics).map(([category, topics]) => ({
      category,
      topics
    }));
    return groupedArray
  });

  const currentCategory = (categoryId: string) => {
    return data.categories.find(c => c.id === categoryId)
  }
</script>

<div class="pt-16">
	<Header />
  <div class="max-container">
    <h1 class="mt-4 mb-3 text-2xl font-light max-w-[15em]">
      Stärke deine Empathiefähigkeit, Schritt für Schritt.
    </h1>
    <h2 class="mb-10 text-2xl font-light text-black/40 max-w-[14em]">
      Lerne praktische Werkzeuge, um klar, mitfühlend und selbstbewusst zu kommunizieren.
    </h2>

    <div>
      {#if categories() && data.categories}
        {#each categories() as category}
          <h3 class="text-xl font-bold mb-4">
            {currentCategory(category.category)?.nameDE}
          </h3>
          <div class="flex gap-4">
            {#each category.topics as topic}
            <a style="background-color: {currentCategory(category.category)?.color}" href={`/bullshift/learn/${topic.id}`} class="w-52 h-60 rounded-lg flex items-end justify-start p-4 text-sm relative overflow-hidden">
              <h4 class="text-xl font-light relative z-10">
                <span>{topic.titleDE.split('||')[0]}</span>
                <span>{topic.titleDE.split('||')[1]}</span>
              </h4>
              <img src={`https://${PUBLIC_BACKEND_URL}/api/files/${topic.collectionId}/${topic.id}/${topic.image}`} alt={`background ${topic.titleDE}`} class="absolute top-0 left-1/3 w-full -z-0 transform -rotate-6">
            </a>
            {/each}

          </div>
        {/each}
      {/if}
    </div>
  </div>
  <Footer />
</div>
