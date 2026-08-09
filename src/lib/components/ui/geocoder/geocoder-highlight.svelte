<script lang="ts">
	let { text, query, class: className }: { text: string; query: string; class?: string } = $props();

	// The query is raw user input, so it has to be escaped before it can be used
	// as a pattern — otherwise typing "(" throws a SyntaxError during render.
	const escape = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	let parts = $derived.by(() => {
		if (!query) return [{ text, highlight: false }];
		const regex = new RegExp(`(${escape(query)})`, 'gi');
		return text.split(regex).map((part) => ({
			text: part,
			highlight: part.toLowerCase() === query.toLowerCase()
		}));
	});
</script>

<span class={className}>
	{#each parts as part}
		{#if part.highlight}
			<span class="bg-yellow-200 dark:bg-yellow-900/50 font-semibold text-foreground"
				>{part.text}</span
			>
		{:else}
			{part.text}
		{/if}
	{/each}
</span>
