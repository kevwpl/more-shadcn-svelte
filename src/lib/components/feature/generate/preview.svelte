<script lang="ts">
	import { blur, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { files, usage, isDark }: { files: any[]; usage: string; isDark: boolean } = $props();

	let previewUrl = $state<string | null>(null);
	let error = $state<string | null>(null);

	async function render() {
		if (!files?.length || !usage) return;
		try {
			error = null;
			const { compile } = await import('https://esm.sh/svelte@5.1.12/compiler');

			// Define absolute paths for the browser to find Svelte internals
			const imports: Record<string, string> = {
				'svelte': 'https://esm.sh/svelte@5.1.12',
				'svelte/internal': 'https://esm.sh/svelte@5.1.12/src/internal',
				'svelte/internal/client': 'https://esm.sh/svelte@5.1.12/internal/client',
				'svelte/internal/disclose-version': 'https://esm.sh/svelte@5.1.12/internal/disclose-version',
				'svelte/internal/flags/legacy': 'https://esm.sh/svelte@5.1.12/internal/flags/legacy',
				'lucide-svelte': 'https://esm.sh/lucide-svelte@0.469.0?bundle',
				'$lib/utils': "data:text/javascript,export function cn(...inputs){ return inputs.flat().filter(Boolean).join(' '); }"
			};

			// Process AI files into Data URIs
			for (const file of files) {
				const fileName = file.path.split('/').pop() || '';
				const nameNoExt = fileName.replace(/\.(svelte|ts|js)$/, '');
				let content = file.content;

				if (fileName.endsWith('.svelte')) {
					const sanitized = content
						.replace(/lang="ts"/g, '')
						.replace(/:\s*[A-Z][a-zA-Z0-9<>[\]]*/g, '')
						.replace(/\s+as\s+[A-Z][a-zA-Z0-9<>[\]]*/g, '');
					content = compile(sanitized, { generate: 'client', dev: false }).js.code;
				} else {
					// Minimal TS cleanup for non-svelte files
					content = content
						.replace(/import\s+type.*?;/g, '')
						.replace(/export\s+type.*?;/g, '')
						.replace(/:\s*[A-Z][a-zA-Z0-9<>[\]]*/g, '');
				}

				const b64 = btoa(unescape(encodeURIComponent(content)));
				const dataUri = `data:text/javascript;base64,${b64}`;

				imports[`./${fileName}`] = dataUri;
				imports[`./${nameNoExt}`] = dataUri;
				if (fileName.startsWith('index')) {
					imports['./index'] = dataUri;
				}
			}

			// Compile the usage example
			const sanitizedUsage = usage.replace(/lang="ts"/g, '');
			const { js } = compile(sanitizedUsage, { generate: 'client', dev: false });
			const b64Usage = btoa(unescape(encodeURIComponent(js.code)));
			const usageUrl = `data:text/javascript;base64,${b64Usage}`;

			const html = `
<!DOCTYPE html>
<html class="${isDark ? 'dark' : ''}">
<head>
    <meta charset="utf-8">
    <script src="https://cdn.tailwindcss.com"></script>
<script type="importmap">${JSON.stringify({ imports })}</script>
<style>
	:root { --background: oklch(1 0 0); --foreground: oklch(0.145 0 0); --primary: oklch(0.205 0 0); --primary-foreground: oklch(0.985 0 0); --secondary: oklch(0.97 0 0); --secondary-foreground: oklch(0.205 0 0); --border: oklch(0.922 0 0); --radius: 0.625rem; }
	.dark { --background: oklch(0.145 0 0); --foreground: oklch(0.985 0 0); --primary: oklch(0.922 0 0); --primary-foreground: oklch(0.205 0 0); --secondary: oklch(0.269 0 0); --secondary-foreground: oklch(0.985 0 0); }
	body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: var(--background); color: var(--foreground); font-family: sans-serif; overflow: auto; }
	#app { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
</style>
<script>
	tailwind.config = { darkMode: 'class', theme: { extend: { colors: { background: 'var(--background)', foreground: 'var(--foreground)', primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' }, secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' }, border: 'var(--border)' } } } };
</script>
</head>
<body>
<div id="app"></div>
<script type="module">
	import { mount } from 'svelte';
	import App from '${usageUrl}';
	try {
		mount(App, { target: document.getElementById("app") });
	} catch (err) {
		document.body.innerHTML = '<div style="color:#ef4444;font-family:monospace;padding:20px;font-size:12px"><strong>Mount Error:</strong><br/>' + err.message + '</div>';
	}
</script>
</body>
</html>`;

previewUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
} catch (e: any) {
	error = e.message;
}
}

$effect(() => {
	render();
});
</script>

<div class="h-full w-full" in:scale={{ start: 0.98, duration: 600, easing: cubicOut }}>
	<div class="h-full w-full overflow-hidden" in:blur={{ duration: 800, easing: cubicOut }}>
		{#if previewUrl}
			<iframe
				src={previewUrl}
				title="Preview"
				class="h-full w-full border-0 transition-colors duration-200"
				sandbox="allow-scripts allow-same-origin"
			></iframe>
		{:else if error}
			<div class="flex h-full items-center justify-center p-8 text-center">
				<div class="rounded-lg border border-destructive/20 bg-destructive/10 p-4 font-mono text-xs text-destructive">
					{error}
				</div>
			</div>
		{:else}
			<div class="bg-background flex h-full items-center justify-center">
				<span class="text-muted-foreground animate-pulse text-[10px] font-bold uppercase tracking-widest">Assembling Workspace...</span>
			</div>
		{/if}
	</div>
</div>