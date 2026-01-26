<script lang="ts">
	import { blur, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { files, usage, isDark }: { files: any[]; usage: string; isDark: boolean } = $props();

	const sOpen = '<sc' + 'ript';
	const sClose = '</sc' + 'ript>';

	async function generatePreview() {
		const { compile } = await import('https://esm.sh/svelte@5.1.12/compiler');

		const imports: Record<string, string> = {
			svelte: 'https://esm.sh/svelte@5.1.12',
			'svelte/': 'https://esm.sh/svelte@5.1.12/',
			'lucide-svelte': 'https://esm.sh/lucide-svelte',
			'$lib/utils':
				"data:text/javascript,export function cn(...inputs){ return inputs.flat().filter(Boolean).join(' '); }"
		};

		for (const file of files) {
			const fileName = file.path.split('/').pop() || '';
			const nameNoExt = fileName.replace(/\.(svelte|ts|js)$/, '');
			let code = file.content;

			if (fileName.endsWith('.svelte')) {
				const sanitized = code
					.replace(/lang="ts"/g, '')
					.replace(/:\s*[A-Z][a-zA-Z0-9<>[\]]*/g, '')
					.replace(/\s+as\s+[A-Z][a-zA-Z0-9<>[\]]*/g, '');
				code = compile(sanitized, { generate: 'client' }).js.code;
			} else {
				code = code
					.replace(/import\s+type.*?;/g, '')
					.replace(/export\s+type.*?;/g, '')
					.replace(/:\s*[A-Z][a-zA-Z0-9<>[\]]*/g, '');
			}

			const blob = new Blob([code], { type: 'text/javascript' });
			const url = URL.createObjectURL(blob);

			imports[`./${fileName}`] = url;
			imports[`./${nameNoExt}`] = url;
			imports[`./${nameNoExt}.js`] = url;
			imports[`./${nameNoExt}.ts`] = url;
		}

		const indexFile = files.find((f) => f.path.endsWith('index.ts') || f.path.endsWith('index.js'));
		const exportMatches = indexFile?.content.match(/as\s+(\w+)/g);
		const componentList = exportMatches
			? exportMatches.map((m: string) => m.replace('as ', '').trim()).join(', ')
			: 'Root';

		const wrapperSource = [
			'<script>',
			"import * as Components from './index.ts';",
			'const { ' + componentList + ' } = Components;',
			sClose,
			'<div class="flex flex-col items-center justify-center w-full p-10">',
			usage.replace(/<script.*?>[\s\S]*?<\/script>/, ''),
			'</div>'
		].join('\n');

		const compiledWrapper = compile(wrapperSource, { generate: 'client' });
		const wrapperUrl = URL.createObjectURL(
			new Blob([compiledWrapper.js.code], { type: 'text/javascript' })
		);

		const html = [
			'<!DOCTYPE html>',
			'<html class="' + (isDark ? 'dark' : '') + '">',
			'<head>',
			'<meta charset="utf-8">',
			sOpen + ' src="https://cdn.tailwindcss.com">' + sClose,
			sOpen + ' type="importmap">' + JSON.stringify({ imports }) + sClose,
			'<style>',
			':root { --background: oklch(1 0 0); --foreground: oklch(0.145 0 0); --primary: oklch(0.205 0 0); --primary-foreground: oklch(0.985 0 0); --secondary: oklch(0.97 0 0); --secondary-foreground: oklch(0.205 0 0); --muted: oklch(0.97 0 0); --muted-foreground: oklch(0.556 0 0); --accent: oklch(0.97 0 0); --accent-foreground: oklch(0.205 0 0); --border: oklch(0.922 0 0); --input: oklch(0.922 0 0); --ring: oklch(0.708 0 0); --radius: 0.625rem; }',
			'.dark { --background: oklch(0.145 0 0); --foreground: oklch(0.985 0 0); --primary: oklch(0.922 0 0); --primary-foreground: oklch(0.205 0 0); --secondary: oklch(0.269 0 0); --secondary-foreground: oklch(0.985 0 0); }',
			'body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: var(--background); color: var(--foreground); font-family: sans-serif; overflow: auto; }',
			'#app { width: 100%; display: flex; justify-content: center; align-items: center; }',
			'</style>',
			sOpen + '>',
			"tailwind.config = { darkMode: 'class', theme: { extend: { colors: { background: 'var(--background)', foreground: 'var(--foreground)', primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' }, secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' }, border: 'var(--border)', input: 'var(--input)', ring: 'var(--ring)' } } } };",
			sClose,
			'</head>',
			'<body>',
			'<div id="app"></div>',
			sOpen + ' type="module">',
			"import * as svelte from 'svelte';",
			"import App from '" + wrapperUrl + "';",
			'try {',
			'  svelte.mount(App, { target: document.getElementById("app") });',
			'} catch (err) {',
			'  document.getElementById("app").innerHTML = \'<div style="color:#ef4444;font-family:monospace;padding:20px;font-size:12px"><strong>Mount Error:</strong><br/>\' + err.message + \'</div>\';',
			'}',
			sClose,
			'</body>',
			'</html>'
		].join('\n');

		return URL.createObjectURL(new Blob([html], { type: 'text/html' }));
	}

	let urlPromise = $derived(generatePreview());
</script>

<div class="h-full w-full" in:scale={{ start: 0.98, duration: 600, easing: cubicOut }}>
	<div class="h-full w-full overflow-hidden" in:blur={{ duration: 800, easing: cubicOut }}>
		{#await urlPromise}
			<div class="bg-background flex h-full items-center justify-center">
				<span
					class="text-muted-foreground animate-pulse text-[10px] font-bold uppercase tracking-widest"
					>Linking Modules...</span
				>
			</div>
		{:then url}
			<iframe
				src={url}
				title="Preview"
				class="h-full w-full border-0 transition-colors duration-200"
				sandbox="allow-scripts allow-same-origin"
			></iframe>
		{/await}
	</div>
</div>
