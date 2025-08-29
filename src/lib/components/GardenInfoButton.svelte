<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { clsx } from 'clsx';

	let infoDrawerActive = $state(false);
</script>

<Drawer.Root snapPoints={['300px', 1]} bind:activeSnapPoint={infoDrawerActive}>
  <Drawer.Trigger>
    <button class="absolute z-20 bottom-[82px] right-4 gap-2 rounded-full border border-white bg-offwhite size-6 flex items-center justify-center">
      <span class="text-xs">❓</span>
    </button>
  </Drawer.Trigger>
  <Drawer.Overlay class="fixed inset-0 bg-black/40" />
  <Drawer.Portal>
    <Drawer.Content class="fixed flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
      <div
        class={clsx("flex flex-col max-w-md mx-auto w-full p-4 pt-5", {
          "overflow-y-auto": infoDrawerActive === 1,
          "overflow-hidden": infoDrawerActive !== 1,
        })}
      >
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="text-lg">🌱</span>
          <h1 class="text-2xl font-medium text-gray-900 dark:text-white">Wie funktioniert der Garten?</h1>
        </div>

        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <span class="text-2xl">💬</span>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-1">
                Gespräche abschließen
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Klicke auf "Chat Abschließen" um Samen zu verdienen
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-2xl">🌱</span>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-1">
                Pflanzen kaufen
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Verwende deine Samen um Blumen, Bäume und Dekorationen zu kaufen
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-2xl">🌤️</span>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-1">
                Wetter & Stimmung
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Das Wetter in deinem Garten spiegelt deine aktuelle Stimmung wider
              </p>
            </div>
          </div>
        </div>
      </div>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>