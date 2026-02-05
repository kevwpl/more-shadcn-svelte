<script lang="ts">
	import * as Stepper from '$lib/components/ui/stepper';
	import { Button } from '$lib/components/ui/button';
	import { Mail, User, Shield, Check } from 'lucide-svelte';

	let currentStep = $state(0);
	const steps = [
		{ label: 'Account', icon: Mail },
		{ label: 'Profile', icon: User },
		{ label: 'Review', icon: Shield }
	];
</script>

<div class="rounded-xl border bg-card p-6 shadow-sm w-full">
	<h3 class="font-semibold leading-none tracking-tight mb-1">Stepper</h3>
	<p class="text-sm text-muted-foreground mb-6">Guided multi-step workflows.</p>

	<Stepper.Root bind:value={currentStep}>
		{#each steps as s, i}
			<Stepper.Item step={i}>
				<Stepper.Trigger step={i}>
					<Stepper.Indicator step={i}>
						{#snippet children()}
							<s.icon class="size-4" />
						{/snippet}
					</Stepper.Indicator>
					<div class="mt-2 text-center">
						<Stepper.Title class="text-xs uppercase text-muted-foreground">{s.label}</Stepper.Title>
					</div>
				</Stepper.Trigger>
				{#if i !== steps.length - 1}
					<Stepper.Separator />
				{/if}
			</Stepper.Item>
		{/each}
	</Stepper.Root>

	<div class="rounded-lg border bg-muted/30 p-4 mt-6 min-h-[80px] flex flex-col justify-center">
		{#if currentStep === 0}
			<div class="space-y-2">
				<div class="h-2 w-16 bg-muted-foreground/20 rounded"></div>
				<div class="h-8 w-full bg-background rounded border"></div>
			</div>
		{:else if currentStep === 1}
			<div class="space-y-2">
				<div class="h-2 w-20 bg-muted-foreground/20 rounded"></div>
				<div class="h-8 w-full bg-background rounded border"></div>
			</div>
		{:else}
			<div class="flex items-center justify-center gap-2 text-primary font-medium text-sm">
				<Check class="size-4" /> Ready to submit
			</div>
		{/if}
	</div>

	<div class="flex gap-2 mt-4">
		<Button
			variant="outline"
			size="sm"
			class="flex-1"
			onclick={() => (currentStep = Math.max(0, currentStep - 1))}
			disabled={currentStep === 0}
		>
			Back
		</Button>
		<Button size="sm" class="flex-1" onclick={() => (currentStep = Math.min(2, currentStep + 1))}>
			{currentStep === 2 ? 'Submit' : 'Next'}
		</Button>
	</div>
</div>
