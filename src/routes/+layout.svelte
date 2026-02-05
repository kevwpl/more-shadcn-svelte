<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import { docsConfig } from '$lib/config/docs';

	let { children } = $props();

	let currentTitle = $derived.by(() => {
		const baseTitle = 'More Shadcn';
		const currentPath = page.url.pathname;

		if (currentPath === '/') return `Introduction – ${baseTitle}`;

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

{@render children()}
