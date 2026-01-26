<script lang="ts">
	import Sidebar from '$lib/components/feature/generate/sidebar.svelte';
	import Workbench from '$lib/components/feature/generate/workbench.svelte';
	import { Sparkle } from 'lucide-svelte';

	let apiKey = $state('');
	let prompt = $state('');
	let isGenerating = $state(false);
	let isDark = $state(false);
	let history = $state<{ role: 'user' | 'assistant'; content: string }[]>([]);
	let result = $state<any>(null);

	$effect(() => {
		const updateTheme = () => (isDark = document.documentElement.classList.contains('dark'));
		const obs = new MutationObserver(updateTheme);
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		updateTheme();
		return () => obs.disconnect();
	});

	async function engineer() {
		if (!prompt || !apiKey || isGenerating) return;
		const userPrompt = prompt;
		prompt = '';
		isGenerating = true;
		history = [...history, { role: 'user', content: userPrompt }];

		try {
			const res = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: history, apiKey })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			result = data;
			history = [...history, { role: 'assistant', content: JSON.stringify(data) }];
		} catch (e: any) {
			alert(e.message);
		} finally {
			isGenerating = false;
		}
	}
</script>

<div class="grid h-[calc(100vh-60px)] w-full grid-cols-[1fr_400px] overflow-hidden bg-background">
	<div class="flex flex-col min-w-0 overflow-hidden border-r">
		{#if result}
			<Workbench {result} {isDark} />
		{:else}
			<div class="flex h-full flex-col items-center justify-center bg-muted/5 opacity-20 gap-3">
				<Sparkle class="size-12" />
				<p class="text-xs font-bold uppercase tracking-[0.2em]">Awaiting Instruction</p>
			</div>
		{/if}
	</div>

	<div class="h-full w-[400px] overflow-y-auto">
		<Sidebar bind:apiKey bind:prompt {history} {isGenerating} onEngineer={engineer} />
	</div>
</div>
