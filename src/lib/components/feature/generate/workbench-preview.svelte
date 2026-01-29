<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Code from '$lib/components/ui/code';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { blur, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let {
		files,
		usage,
		isDark,
		title
	}: { files: any[]; usage: string; isDark: boolean; title: string } = $props();

	let previewUrl = $state<string | null>(null);
	let errorMessage = $state<string | null>(null);

	const sOpen = '<scr' + 'ipt';
	const sClose = '</scr' + 'ipt>';

	// --- 1. Utilities ---

	function fixRenderTags(code: string): string {
		return code
			.replace(/\{@render\s+(\w+)\s*\}/g, '{@render $1()}')
			.replace(/\{@render\s+(\w+)\?\s*\}/g, '{@render $1?.()}')
			.replace(/\{@render\s+(\w+)\s+\?\s*\}/g, '{@render $1?.()}');
	}

	function stripSvelteTypes(code: string): string {
		return code
			.replace(/lang="ts"/g, '')
			.replace(/import\s+type\s+[^;]+;/g, '')
			.replace(/export\s+type\s+[^;]+;/g, '')
			.replace(/<[A-Z][a-zA-Z0-9<>,\s]*>(?=\s*\()/g, '')
			.replace(/\$props<[^>]+>\(\)/g, '$props()')
			.replace(
				/:\s*(?:string|number|boolean|any|void|null|undefined|Record<[^>]+>|Array<[^>]+>|\{[^}]*\}|[A-Z][a-zA-Z0-9]*(?:<[^>]+>)?(?:\s*\|\s*(?:string|number|boolean|null|undefined|[A-Z][a-zA-Z0-9]*(?:<[^>]+>)?))*)\s*(?=[,);=\n])/g,
				''
			)
			.replace(/\)\s*:\s*[A-Z][a-zA-Z0-9<>[\]|&\s]*(?=\s*\{)/g, ')')
			.replace(
				/\s+as\s+(?:string|number|boolean|any|const|[A-Z][a-zA-Z0-9<>[\]]*)\s*(?=[,);}\]\n])/g,
				''
			);
	}

	function stripTsFileTypes(code: string): string {
		return code
			.replace(/import\s+type\s+[^;]+;/g, '')
			.replace(/export\s+type\s+[^;]+;/g, '')
			.replace(/^export\s+interface\s+[^{]+\{[\s\S]*?\n\}/gm, '')
			.replace(/:\s*(?:string|number|boolean|any|void|null|undefined)\s*(?=[,);=])/g, '');
	}

	function buildWrapper(scriptContent: string, templateContent: string): string {
		return [
			'<script>',
			scriptContent,
			'</' + 'script>',
			'<div class="flex flex-col items-center justify-center w-full p-10">',
			templateContent,
			'</div>'
		].join('\n');
	}

	// --- 2. Icon Fetching Logic ---

	const FALLBACK_ICON_SVG =
		'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="1"></circle><circle cx="15" cy="15" r="1"></circle>';

	async function fetchIconContent(iconName: string): Promise<string> {
		const kebab = iconName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
		try {
			const res = await fetch(`https://unpkg.com/lucide-static@0.469.0/icons/${kebab}.svg`);
			if (!res.ok) throw new Error('Icon not found');
			const svg = await res.text();
			const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
			return innerMatch ? innerMatch[1] : FALLBACK_ICON_SVG;
		} catch (e) {
			console.warn(`Failed to load icon ${iconName}, using fallback.`);
			return FALLBACK_ICON_SVG;
		}
	}

	async function prepareLucideModule(files: any[], usage: string, compile: any): Promise<string> {
		const allCode = [usage, ...files.map((f) => f.content)].join('\n');
		const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-svelte['"]/g;

		// Map of exportedName -> originalIconName (e.g., "CalendarIcon" -> "Calendar")
		const iconsToFetch = new Map<string, string>();

		let match;
		while ((match = importRegex.exec(allCode)) !== null) {
			const imports = match[1].split(',');
			for (const imp of imports) {
				const trimmed = imp.trim();
				// Handle "Calendar as CalendarIcon"
				const parts = trimmed.split(/\s+as\s+/);
				if (parts.length === 2) {
					// parts[0] is original name (Calendar), parts[1] is alias (CalendarIcon)
					// We need to export 'Calendar' so the import { Calendar as ... } works
					iconsToFetch.set(parts[0], parts[0]);
				} else {
					// Standard import { Check }
					iconsToFetch.set(trimmed, trimmed);
				}
			}
		}

		if (iconsToFetch.size === 0) return 'export default {};';

		const iconPromises = Array.from(iconsToFetch.keys()).map(async (iconName) => {
			const svgContent = await fetchIconContent(iconName);
			const componentSrc = `
				<script>
					let { class: className, size = 24, strokeWidth = 2, ...rest } = $props();
				<\/script>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width={strokeWidth}
					stroke-linecap="round"
					stroke-linejoin="round"
					class={className}
					{...rest}
				>
					${svgContent}
				</svg>
			`;
			const compiled = compile(componentSrc, { generate: 'client' });
			const blobUrl = URL.createObjectURL(
				new Blob([compiled.js.code], { type: 'text/javascript' })
			);
			return { name: iconName, url: blobUrl };
		});

		const results = await Promise.all(iconPromises);
		return results.map((r) => `export { default as ${r.name} } from "${r.url}";`).join('\n');
	}

	// --- 3. Main Generator ---

	async function generatePreview() {
		errorMessage = null;
		if (!files?.length || !usage) return;

		console.groupCollapsed('🔧 Preview Generation');
		console.log('Title:', title);

		try {
			const { compile } = await import('https://esm.sh/svelte@5.1.12/compiler');

			const imports: Record<string, string> = {
				svelte: 'https://esm.sh/svelte@5.1.12',
				'svelte/': 'https://esm.sh/svelte@5.1.12/',
				'$lib/utils':
					"data:text/javascript,export function cn(...inputs){ return inputs.flat().filter(Boolean).join(' '); }"
			};

			// Handle Lucide Icons
			try {
				const lucideModuleCode = await prepareLucideModule(files, usage, compile);
				imports['lucide-svelte'] = URL.createObjectURL(
					new Blob([lucideModuleCode], { type: 'text/javascript' })
				);
			} catch (err) {
				console.error('Lucide prep error:', err);
			}

			// Process Files
			for (const file of files) {
				const fileName = file.path.split('/').pop() || '';
				const nameNoExt = fileName.replace(/\.(svelte|ts|js)$/, '');
				let content = file.content;

				if (fileName.endsWith('.svelte')) {
					const fixed = fixRenderTags(content);
					const stripped = stripSvelteTypes(fixed);
					try {
						const compiled = compile(stripped, { generate: 'client' });
						content = compiled.js.code;
					} catch (compileErr: any) {
						console.error(`❌ Compile error in file: ${fileName}`);
						console.log('Failing Code:', stripped);
						throw new Error(`Compile error in ${fileName}: ${compileErr.message}`);
					}
				} else if (fileName.endsWith('.ts')) {
					content = stripTsFileTypes(content);
				}

				const url = URL.createObjectURL(new Blob([content], { type: 'text/javascript' }));
				imports['./' + fileName] = url;
				imports['./' + nameNoExt] = url;
				if (fileName.startsWith('index')) {
					imports['./index'] = url;
					imports['./index.js'] = url;
					imports['./index.ts'] = url;
				}
			}

			// Process Usage
			const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/;
			const scriptMatch = usage.match(scriptRegex);
			const scriptContent = scriptMatch ? scriptMatch[1].trim() : '';
			const templateContent = usage.replace(scriptRegex, '');

			const wrapperSource = buildWrapper(scriptContent, templateContent);

			let compiledWrapper;
			try {
				compiledWrapper = compile(wrapperSource, { generate: 'client' });
			} catch (compileErr: any) {
				console.error(`❌ Compile error in Usage Wrapper`);
				console.log('Failing Wrapper Source:', wrapperSource);
				throw new Error(`Usage Example Compilation Failed: ${compileErr.message}`);
			}

			const wrapperUrl = URL.createObjectURL(
				new Blob([compiledWrapper.js.code], { type: 'text/javascript' })
			);

			console.log('Import Map:', imports);
			console.groupEnd();

			const html = `<!DOCTYPE html>
<html class="${isDark ? 'dark' : ''}">
<head>
<meta charset="utf-8">
${sOpen} src="https://cdn.tailwindcss.com">${sClose}
${sOpen} type="importmap">${JSON.stringify({ imports })}${sClose}
<style>
:root { --background: oklch(1 0 0); --foreground: oklch(0.145 0 0); --card: oklch(1 0 0); --card-foreground: oklch(0.145 0 0); --popover: oklch(1 0 0); --popover-foreground: oklch(0.145 0 0); --primary: oklch(0.205 0 0); --primary-foreground: oklch(0.985 0 0); --secondary: oklch(0.97 0 0); --secondary-foreground: oklch(0.205 0 0); --muted: oklch(0.97 0 0); --muted-foreground: oklch(0.556 0 0); --accent: oklch(0.97 0 0); --accent-foreground: oklch(0.205 0 0); --destructive: oklch(0.577 0.245 27.325); --destructive-foreground: oklch(1 0 0); --border: oklch(0.922 0 0); --input: oklch(0.922 0 0); --ring: oklch(0.708 0 0); --radius: 0.625rem; }
.dark { --background: oklch(0.145 0 0); --foreground: oklch(0.985 0 0); --card: oklch(0.205 0 0); --card-foreground: oklch(0.985 0 0); --popover: oklch(0.269 0 0); --popover-foreground: oklch(0.985 0 0); --primary: oklch(0.922 0 0); --primary-foreground: oklch(0.205 0 0); --secondary: oklch(0.269 0 0); --secondary-foreground: oklch(0.985 0 0); --muted: oklch(0.269 0 0); --muted-foreground: oklch(0.708 0 0); --accent: oklch(0.371 0 0); --accent-foreground: oklch(0.985 0 0); --destructive: oklch(0.704 0.191 22.216); --destructive-foreground: oklch(0.985 0 0); --border: oklch(0.275 0 0); --input: oklch(0.325 0 0); --ring: oklch(0.556 0 0); }
body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: var(--background); color: var(--foreground); font-family: ui-sans-serif, system-ui, sans-serif; overflow: auto; }
#app { width: 100%; display: flex; justify-content: center; align-items: center; }
</style>
${sOpen}>
tailwind.config = { darkMode: 'class', theme: { extend: { colors: { background: 'var(--background)', foreground: 'var(--foreground)', card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' }, popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' }, primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' }, secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' }, muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' }, accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' }, destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' }, border: 'var(--border)', input: 'var(--input)', ring: 'var(--ring)' }, borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' } } } };
${sClose}
</head>
<body>
<div id="app"></div>
${sOpen} type="module">
import * as svelte from 'svelte';
import App from '${wrapperUrl}';
try {
svelte.mount(App, { target: document.getElementById('app') });
} catch (err) {
document.getElementById('app').innerHTML = '<div style="color:#ef4444;font-family:monospace;padding:20px;font-size:12px;max-width:600px;word-break:break-word"><strong>Mount Error:</strong><br/>' + err.message + '<br/><br/><pre>' + err.stack + '</pre></div>';
console.error('Mount error:', err);
}
${sClose}
</body>
</html>`;

			previewUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
		} catch (e: any) {
			console.error('Generation error:', e);
			errorMessage = e.message;
		}
	}

	$effect(() => {
		generatePreview();
	});
</script>

<Tabs.Content value="preview" class="m-0 flex h-full flex-col overflow-hidden">
	<div class="relative min-h-0 flex-1 overflow-hidden bg-background">
		{#if previewUrl}
			<div class="h-full w-full" in:scale={{ start: 0.98, duration: 600, easing: cubicOut }}>
				<div class="h-full w-full overflow-hidden" in:blur={{ duration: 800, easing: cubicOut }}>
					<iframe
						src={previewUrl}
						title="Preview"
						class="h-full w-full border-0 transition-colors duration-200"
						sandbox="allow-scripts allow-same-origin"
					></iframe>
				</div>
			</div>
		{:else if errorMessage}
			<div class="flex h-full items-center justify-center p-10">
				<div
					class="rounded-lg border border-destructive/20 bg-destructive/10 p-4 font-mono text-xs text-destructive"
				>
					{errorMessage}
				</div>
			</div>
		{:else}
			<div class="flex h-full items-center justify-center bg-background">
				<span
					class="animate-pulse text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
					>Linking Modules...</span
				>
			</div>
		{/if}
	</div>

	<div class="h-[33vh] shrink-0 border-t bg-muted/20">
		<ScrollArea class="h-full w-full">
			<div class="p-4 pt-3">
				<p class="px-1 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
					Implementation Example
				</p>
				<Code.Root code={usage} lang="svelte" class="bg-background shadow-inner">
					<Code.CopyButton />
				</Code.Root>
			</div>
		</ScrollArea>
	</div>
</Tabs.Content>
