<script lang="ts">
	import { cn } from '$lib/utils';
	import { Check, Loader2, ShieldCheck, X } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let {
		class: className,
		onVerify,
		verified = $bindable(false)
	}: {
		class?: string;
		onVerify?: () => void;
		verified?: boolean;
	} = $props();

	let status = $state<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
	let mountTime = 0;
	let humanInteraction = false;
	let honeypot = $state(false);

	onMount(() => {
		mountTime = Date.now();

		const markHuman = () => {
			humanInteraction = true;
		};
		window.addEventListener('mousemove', markHuman, { once: true });
		window.addEventListener('touchstart', markHuman, { once: true });
		window.addEventListener('keydown', markHuman, { once: true });

		return () => {
			window.removeEventListener('mousemove', markHuman);
			window.removeEventListener('touchstart', markHuman);
			window.removeEventListener('keydown', markHuman);
		};
	});

	function runHeuristics(e: MouseEvent | TouchEvent | KeyboardEvent) {
		if (honeypot) return false;

		if (Date.now() - mountTime < 500) return false;

		if (!humanInteraction) return false;

		if (!e.isTrusted) return false;

		return true;
	}

	async function handleClick(e: any) {
		if (status !== 'idle' && status !== 'failed') return;

		status = 'verifying';

		await new Promise((r) => setTimeout(r, 800));

		if (runHeuristics(e)) {
			status = 'verified';
			verified = true;
			onVerify?.();
		} else {
			status = 'failed';
			verified = false;
			setTimeout(() => {
				status = 'idle';
			}, 2000);
		}
	}
</script>

<input
	type="checkbox"
	class="absolute opacity-0 -z-10 w-0 h-0"
	tabindex="-1"
	bind:checked={honeypot}
	autocomplete="off"
/>

<button
	onclick={handleClick}
	class={cn(
		'group flex items-center justify-between w-[300px] h-16 px-4 rounded-md border bg-card text-card-foreground shadow-sm transition-all select-none',
		status === 'idle' && 'hover:bg-accent/5 cursor-pointer',
		status === 'failed' && 'border-red-500/50 bg-red-500/5 cursor-not-allowed',
		(status === 'verifying' || status === 'verified') && 'cursor-default',
		className
	)}
	type="button"
>
	<div class="flex items-center gap-3">
		<div
			class={cn(
				'relative flex items-center justify-center w-7 h-7 rounded border-2 bg-background transition-all duration-300',
				status === 'idle' && 'border-muted-foreground/30 group-hover:border-muted-foreground/50',
				status === 'verifying' && 'border-transparent',
				status === 'verified' && 'border-primary bg-primary',
				status === 'failed' && 'border-destructive'
			)}
		>
			{#if status === 'verifying'}
				<Loader2 class="h-8 w-8 text-primary animate-spin absolute" />
			{/if}

			{#if status === 'verified'}
				<Check
					class="h-4 w-4 text-primary-foreground animate-in zoom-in duration-300"
					strokeWidth={3}
				/>
			{/if}

			{#if status === 'failed'}
				<X class="h-4 w-4 text-destructive animate-in zoom-in duration-300" strokeWidth={3} />
			{/if}
		</div>

		<div class="flex flex-col items-start">
			<span class="text-sm font-medium leading-none">
				{#if status === 'verified'}
					I am human
				{:else if status === 'failed'}
					Verification failed
				{:else if status === 'verifying'}
					Verifying...
				{:else}
					Verify you are human
				{/if}
			</span>
			{#if status === 'failed'}
				<span class="text-[10px] text-destructive mt-1">Please try again</span>
			{/if}
		</div>
	</div>

	<div class="flex flex-col items-center justify-center gap-0.5 opacity-50">
		<ShieldCheck class="h-6 w-6 text-muted-foreground" />
		<span class="text-[9px] text-muted-foreground leading-none">Secure</span>
	</div>
</button>
