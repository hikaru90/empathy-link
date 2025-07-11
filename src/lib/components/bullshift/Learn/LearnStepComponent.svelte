<script lang="ts">
  import { getLearningContext } from '$lib/contexts/learningContext';
  import type { ComponentStepInfo } from '$lib/contexts/learningContext';
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    pageIndex: number;
    blockIndex: number;
    componentType: string;
    totalSteps?: number;
    currentStep?: number;
  }

  let { pageIndex, blockIndex, componentType, totalSteps = 1, currentStep = 1 }: Props = $props();

  const learningContext = getLearningContext();
  const componentId = `${componentType}-${pageIndex}-${blockIndex}`;

  const updateComponentSteps = () => {
    const stepInfo: ComponentStepInfo = {
      componentId,
      totalSteps,
      currentStep,
      pageIndex,
      blockIndex
    };
    learningContext?.registerComponentSteps(stepInfo);
  };

  // Register component steps on mount
  onMount(() => {
    updateComponentSteps();
  });

  // Unregister on destroy
  onDestroy(() => {
    learningContext?.unregisterComponentSteps(componentId);
  });

  // Update step info when props change
  $effect(() => {
    updateComponentSteps();
  });

  // Export functions for child components
  export function updateSteps(newCurrentStep: number, newTotalSteps?: number) {
    currentStep = newCurrentStep;
    if (newTotalSteps !== undefined) {
      totalSteps = newTotalSteps;
    }
  }
</script>

<slot {updateSteps} />