<script lang="ts">
  import { getLearningContext } from '$lib/contexts/learningContext';

  interface Props {
    topic: any;
    currentPage: number;
    currentCategory: any;
    aiQuestionStep?: 'question' | 'response'; // Optional prop to track AI question sub-step
  }

  let { topic, currentPage, currentCategory, aiQuestionStep }: Props = $props();
  
  const learningContext = getLearningContext();
  
  // Calculate total steps: Title + Components (accounting for multi-step components) + Summary
  const totalSteps = $derived(() => {
    const topicData = topic();
    if (!topicData || !topicData.content || !Array.isArray(topicData.content)) return 2; // Title + Summary if no content
    
    // Get component steps from registered components
    const registeredSteps = learningContext?.getComponentSteps() || [];
    
    // If no components have registered steps, fall back to simple counting
    if (registeredSteps.length === 0) {
      return 1 + topicData.content.length + 1; // Title + Each Component + Summary
    }
    
    // Sum up all component steps, but only count steps for components that exist
    let totalComponentSteps = 0;
    for (let i = 1; i <= topicData.content.length; i++) {
      const componentSteps = registeredSteps.find(s => s.pageIndex === i);
      if (componentSteps) {
        totalComponentSteps += componentSteps.totalSteps;
      } else {
        totalComponentSteps += 1; // Default to 1 step if not registered
      }
    }
    
    return 1 + totalComponentSteps + 1; // Title + All Component Steps + Summary
  });

  // Calculate current logical step position
  const currentLogicalStep = $derived(() => {
    const topicData = topic();
    if (!topicData || !topicData.content || !Array.isArray(topicData.content)) return currentPage;
    
    if (currentPage === 0) return 0; // Title page
    if (currentPage > topicData.content.length) return totalSteps() - 1; // Summary page
    
    // Get component steps from registered components
    const registeredSteps = learningContext?.getComponentSteps() || [];
    
    // If no components have registered steps, fall back to simple mapping
    if (registeredSteps.length === 0) {
      return currentPage;
    }
    
    // Calculate step position based on component registration
    let stepPosition = 1; // Start after title
    
    // Loop through components (pages 1 to currentPage-1)
    for (let i = 1; i < currentPage; i++) {
      const componentSteps = registeredSteps.find(s => s.pageIndex === i);
      if (componentSteps) {
        stepPosition += componentSteps.totalSteps;
      } else {
        stepPosition += 1; // Default to 1 step if not registered
      }
    }
    
    // Add current component's step progress (if we're on a component page)
    if (currentPage > 0) {
      const currentComponentSteps = registeredSteps.find(s => s.pageIndex === currentPage);
      if (currentComponentSteps) {
        stepPosition += currentComponentSteps.currentStep - 1; // -1 because currentStep is 1-indexed
      }
    }
    
    return stepPosition;
  });
</script>

<div class="flex items-center justify-center mb-4">
  <div class="flex items-center justify-center gap-1 bg-neutral-500/5 shadow-inner p-1 rounded-full">
    {#each Array.from({ length: totalSteps() }, (_, index) => index) as stepIndex}
    <div
    style="background-color: {currentLogicalStep() >= stepIndex ? (currentCategory()?.color || '#666') : 'rgba(255,255,255,0.8)'}"
    class="h-2 w-4 rounded-full {stepIndex >= totalSteps() - 1 ? 'opacity-80' : ''}"
    ></div>
    {/each}
  </div>
</div>