<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { tv, type VariantProps } from 'tailwind-variants';

	const dotVariants = tv({
		base: 'rounded-full',
		variants: {
			variant: {
				default: 'bg-primary text-primary',
				success: 'bg-emerald-500 text-emerald-500',
				warning: 'bg-amber-500 text-amber-500',
				error: 'bg-rose-500 text-rose-500',
				info: 'bg-sky-500 text-sky-500',
				muted: 'bg-muted-foreground/50 text-muted-foreground/50'
			},
			size: {
				sm: 'h-2 w-2',
				md: 'h-3 w-3',
				lg: 'h-4 w-4'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	});

	type Variant = VariantProps<typeof dotVariants>['variant'];
	type Size = VariantProps<typeof dotVariants>['size'];

	let {
		class: className,
		variant = 'default',
		size = 'md',
		pulse = false,
		...rest
	}: {
		class?: string;
		variant?: Variant;
		size?: Size;
		pulse?: boolean;
		[key: string]: any;
	} = $props();
</script>

<span
	class={cn('relative flex items-center justify-center', dotVariants({ size }), className)}
	{...rest}
>
	{#if pulse}
		<span
			class={cn(
				'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
				dotVariants({ variant, size: undefined })
			)}
		></span>
	{/if}
	<span class={cn('relative inline-flex rounded-full', dotVariants({ variant, size }))}></span>
</span>
