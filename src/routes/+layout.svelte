<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import { docsConfig, LEGACY_DOCS_URL } from '#lib/config/docs.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { Banner } from '#lib/components/ui/banner/index.js';
	import { Zap } from '@lucide/svelte';

	let { children } = $props();

	let currentTitle = $derived.by(() => {
		const baseTitle = 'More Shadcn';
		const currentPath = page.url.pathname;

		if (currentPath === '/') return `${baseTitle}`;

		for (const group of docsConfig) {
			const link = group.links.find((l) => currentPath.endsWith(l.href) && l.href !== '/');
			if (link) {
				return `${link.label} – ${baseTitle}`;
			}
		}

		return baseTitle;
	});
</script>

<svelte:head>
	<title>{currentTitle}</title>
	<link rel="icon" type="image/svg" href="/logo.svg" />
</svelte:head>

<ModeWatcher />

<Tooltip.Provider>
	<Banner id="sveltekit-3" variant="info" align="center">
		{#snippet icon()}
			<Zap class="size-4" />
		{/snippet}
		<span>
			More Shadcn is updated to <strong>SvelteKit 3</strong>
			(<a href="/docs/changelog" class="font-medium underline underline-offset-4">changelog</a>). On
			SvelteKit 2? Use the
			<a href={LEGACY_DOCS_URL} class="font-medium underline underline-offset-4">legacy docs</a>.
		</span>
	</Banner>
	{@render children()}
</Tooltip.Provider>
