<script>
  import { m } from '$lib/translations';
  import { getLocale } from '$src/paraglide/runtime';
	import { checkVisibility } from '$lib/actions';
	import FaqEntry from '$lib/components/FaqEntry.svelte';

  const faqs = [
    {
      question: m.page_home_components_faq1_question(),
      answer: m.page_home_components_faq1_answer()
    },
    {
      question: m.page_home_components_faq2_question(),
      answer: m.page_home_components_faq2_answer()
    },
    {
      question: m.page_home_components_faq3_question(),
      answer: m.page_home_components_faq3_answer()
    },
    {
      question: m.page_home_components_faq4_question(),
      answer: m.page_home_components_faq4_answer()
    },
    {
      question: m.page_home_components_faq5_question(),
      answer: m.page_home_components_faq5_answer()
    },
    {
      question: m.page_home_components_faq6_question(),
      answer: m.page_home_components_faq6_answer()
    }
  ]

</script>


<div class="mb-24 md:mb-40">
  <h2 use:checkVisibility class="transform opacity-0 translate-y-10 is-visible:translate-y-0 is-visible:opacity-100 transition-all duration-700 mb-10 font-display text-4xl font-semibold lg:text-5xl text-left">
    {m.page_home_components_faq_heading()}
  </h2>

  <div class="flex flex-col gap-2">
    {#each faqs as faq, index}
    <FaqEntry {faq} {index} />
    {/each}
  </div>
</div>
