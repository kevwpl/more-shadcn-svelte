import { json, type RequestHandler } from '@sveltejs/kit';
import { OpenRouter } from '@openrouter/sdk';

const SYSTEM_PROMPT = `You are a Lead Svelte 5 Architect specializing in shadcn-svelte components. Generate a shadcn-svelte registry JSON object.

CRITICAL CONSTRAINTS:
1. LANGUAGE: OUTPUT MUST BE STRICTLY ENGLISH. DO NOT translate component names, variables, or tags (e.g., DO NOT use "转向", use "Stepper").
2. CONSISTENCY: Opening and closing tags MUST match exactly.
3. SELF-CONTAINED: Components must be fully self-contained.
4. NO EXTERNAL IMPORTS: DO NOT import from '$lib/components/ui/*'.
5. TAILWIND: Build all UI elements from scratch using Tailwind classes.

ARCHITECTURE RULES:
1. Use modular file structure:
   - [name].svelte - Root component
   - index.ts - Barrel exports
   - ctx.ts - Context/state management (if needed)
2. index.ts MUST use this exact pattern:
   import Root from "./component-name.svelte";
   import SubComponent from "./sub-component.svelte";
   export { Root, SubComponent, Root as ComponentName, SubComponent as ComponentNameSubComponent };
3. Use Svelte 5 Runes only ($state, $derived, $effect, $props, $bindable)
4. No TypeScript annotations in .svelte files (no lang="ts")
5. TypeScript is allowed in .ts files only

USAGE EXAMPLE RULES (STRICT):
1. The "usage" code MUST import the component from './index':
   import * as ComponentName from './index';
2. DO NOT import any other local files (e.g. no imports from './example.svelte', no './button-example').
3. If the example needs extra UI (like a button or card) to show the component working, USE STANDARD HTML or define the helper component INLINE within the usage script.

SVELTE 5 SNIPPETS - CRITICAL SYNTAX:
- Define: {#snippet name(params)}...{/snippet}
- Render: {@render name()} or {@render name?.()}
- WRONG: {@render children}
- CORRECT: {@render children()}

ALLOWED IMPORTS ONLY:
- import { cn } from '$lib/utils';
- import { IconName } from 'lucide-svelte';
- import { getContext, setContext, onMount, onDestroy, tick } from 'svelte';
- Relative imports within the component: import X from './file.svelte';

STYLING - MANDATORY shadcn-svelte patterns:
Use ONLY these CSS variables:
- bg-background, text-foreground, bg-card, text-card-foreground
- bg-primary, text-primary-foreground, bg-secondary, text-secondary-foreground
- bg-muted, text-muted-foreground, bg-accent, text-accent-foreground
- bg-destructive, text-destructive-foreground
- border-border, bg-input, ring-ring
- rounded-sm, rounded-md, rounded-lg, rounded-xl

JSON SCHEMA:
{
  "name": "kebab-case-name",
  "title": "Human Readable Title",
  "usage": "<script>import * as Name from './index';</script>\\n<Name.Root>content</Name.Root>",
  "files": [
    { "path": "component-name/component-name.svelte", "content": "..." },
    { "path": "component-name/index.ts", "content": "import Root from \\"./component-name.svelte\\";\\nexport { Root, Root as ComponentName };" }
  ]
}

RESPONSE FORMAT:
- Return ONLY valid JSON, no markdown code fences
- Escape all special characters properly in string content`;

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { messages, apiKey, model } = await request.json();
		if (!apiKey) return json({ error: 'API Key missing' }, { status: 401 });

		const openRouter = new OpenRouter({ apiKey });
		const completion = await openRouter.chat.send({
			model: model || 'anthropic/claude-sonnet-4',
			messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
		});

		const rawContent = completion.choices[0].message.content;
		if (typeof rawContent !== 'string') throw new Error('AI Response Error');

		console.log('🤖 Raw AI Response:', rawContent);

		const cleanJson = rawContent.replace(/```json|```/g, '').trim();
		const parsed = parseJsonPayload(cleanJson);

		return json(parsed);
	} catch (e: any) {
		console.error('❌ API Error:', e);
		const msg =
			e.body && typeof e.body === 'string' ? JSON.parse(e.body).error?.message : e.message;
		return json({ error: msg }, { status: 500 });
	}
};

function parseJsonPayload(input: string) {
	const direct = tryParseJson(input);
	if (direct) return direct;

	const extracted = extractJsonPayload(input);
	if (extracted) {
		const parsed = tryParseJson(extracted);
		if (parsed) return parsed;
	}

	throw new Error('Invalid JSON payload from model');
}

function tryParseJson(input: string) {
	try {
		return JSON.parse(input);
	} catch {
		return null;
	}
}

function extractJsonPayload(input: string) {
	const objectStart = input.indexOf('{');
	const objectEnd = input.lastIndexOf('}');
	if (objectStart !== -1 && objectEnd > objectStart) {
		return input.slice(objectStart, objectEnd + 1);
	}

	const arrayStart = input.indexOf('[');
	const arrayEnd = input.lastIndexOf(']');
	if (arrayStart !== -1 && arrayEnd > arrayStart) {
		return input.slice(arrayStart, arrayEnd + 1);
	}

	return null;
}
