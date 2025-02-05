<script lang="ts">
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { type SuperValidated, type Infer, defaults, superForm } from 'sveltekit-superforms';
	import FormStepper from '$lib/components/FormStepper.svelte';
	import FormStepDisplay from '$lib/components/FormStepDisplay.svelte';
	import { t, locale } from '$lib/translations';
	import { get } from 'svelte/store';
	import { zodClient, zod } from 'sveltekit-superforms/adapters';
	import {
		schemaStep1,
		schemaStep2,
		schemaStep3,
		schemaStep4,
		schemaStep5 as lastStep
	} from './schema';
	import IconFolder from '$assets/icons/icon-folder.svg?raw';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
	import IconCheckin from '$assets/icons/icon-checkin.svg?raw';
	import { pb } from '$scripts/pocketbase';
	import { onMount } from 'svelte';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import { Textarea } from '$lib/components/ui/textarea';
	import Mascot from '$lib/components/Mascot.svelte';
	import { user } from '$store/auth';
	import Share from '$lib/components/Share.svelte';
	import { backgroundColor } from '$store/page';
	import SelfempathyChat from '$lib/components/SelfempathyChat.svelte';
	const data: SuperValidated<Infer<FormSchema>> = defaults(zod(lastStep));
	let feelings = [];
	let needs = [];
	let checkJudgement;

	const steps = [
		zod(schemaStep1),
		zod(schemaStep2),
		zod(schemaStep3),
		zod(schemaStep4),
		zod(lastStep)
	];
	let step = 1;
	let formSubmitted = false;
	let formSuccess = false;
	let checkForJudgement = false;
	let id: string;
	let createdRecord: object;


	onMount(async () => {
	});
</script>

<div
	class="flex flex-grow flex-col justify-between transition duration-500 dark:bg-background h-svh"
>
	<AppTopMenu />
		<div class="max-container flex flex-grow flex-col pb-20 pt-2 relative h-[calc(100vh-100px)]">
			<div class="flex-grow p-2 h-full">
				
				<SelfempathyChat />
			</div>
	</div>
</div>

<style lang="scss">
	.chat-shadow{
		border: 1px solid rgba(255,255,255,0.2);
		box-shadow: inset 0 2px 2px 0 rgba(0, 0, 0, 0.1), inset 0 -2px 2px 0 rgba(255, 255, 255, 0.2);
	}
</style>
