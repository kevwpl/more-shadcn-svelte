<script lang="ts">
	import { VerifyHuman } from '$lib/components/ui/verify-human';
	import { ShieldCheck } from 'lucide-svelte';

	let isVerified = $state(false);
</script>

<div class="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between h-full">
	<div class="mb-4">
		<div class="flex items-center gap-2 mb-1">
			<h3 class="font-semibold leading-none tracking-tight">Verify Human</h3>
			{#if isVerified}
				<ShieldCheck class="size-4 text-primary animate-in zoom-in duration-300" />
			{/if}
		</div>
		<p class="text-sm text-muted-foreground">Heuristic-based bot protection.</p>
	</div>

	<div class="flex-1 flex items-center justify-center py-4">
		<VerifyHuman bind:verified={isVerified} />
	</div>

	<div class="mt-4 p-2 rounded border border-dashed bg-muted/30 text-center">
		<span
			class="text-[10px] font-medium uppercase tracking-wider {isVerified
				? 'text-primary'
				: 'text-muted-foreground'}"
		>
			{isVerified ? 'Access Granted' : 'Verification Required'}
		</span>
	</div>
</div>
