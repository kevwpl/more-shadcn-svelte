<script lang="ts">
	import { cn } from '#lib/utils.js';

	let { class: className }: { class?: string } = $props();
</script>

<div class={cn('flex shrink-0 items-center justify-center', className)}>
	<div
		class="h-4 w-4 rounded-full border border-primary text-primary shadow-sm flex items-center justify-center ring-offset-background"
	>
		<div
			class="h-2 w-2 rounded-full bg-primary opacity-0 scale-0 transition-all duration-200 group-data-[state=checked]:opacity-100 group-data-[state=checked]:scale-100"
		/>
	</div>
</div>
