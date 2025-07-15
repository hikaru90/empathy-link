<script lang="ts">
	interface Props {
		text?: string;
	}

	let { text = 'Weiter' }: Props = $props();
</script>

<button
	type="button"
	class="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
>
	{text}
</button>
