import { json, type RequestHandler } from '@sveltejs/kit';
import { OpenRouter } from '@openrouter/sdk';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { messages, apiKey } = await request.json();
		if (!apiKey) return json({ error: 'API Key missing' }, { status: 401 });

		const openRouter = new OpenRouter({ apiKey });
		const completion = await openRouter.chat.send({
			model: 'google/gemini-3-flash-preview',
			messages: [
				{
					role: 'system',
					content: `You are a Svelte 5 Architect. Generate a shadcn-svelte registry JSON.

                    STRUCTURE:
                    1. Modular files: [name].svelte, index.ts, ctx.ts.
                    2. "index.ts" MUST use barrel exports: "export { default as Root } from './name.svelte';"
                    3. The "usage" field MUST contain ONLY the component template. No script tags. No imports.
                       Example: "<Stepper.Root> <Stepper.Item step={1} /> </Stepper.Root>"
                    
                    RULES:
                    - Svelte 5 Runes.
                    - Tailwind CSS 4.
                    - NO COMMENTS.
                    - No lang="ts" in .svelte files.`
				},
				...messages
			]
		});

		const rawContent = completion.choices[0].message.content;
		if (typeof rawContent !== 'string') throw new Error('AI Response Error');

		const cleanJson = rawContent.replace(/```json|```/g, '').trim();
		return json(JSON.parse(cleanJson));
	} catch (e: any) {
		return json({ error: e.message }, { status: 500 });
	}
};
