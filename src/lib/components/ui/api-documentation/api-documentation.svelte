<script lang="ts">
	import type { APIRegistry } from '.';

	let { api }: { api: APIRegistry } = $props();

	function formatValue(value: unknown): string {
		if (value === undefined) return '—';
		if (value === null) return 'null';
		if (typeof value === 'string') return value;
		if (typeof value === 'number' || typeof value === 'boolean') return String(value);

		try {
			return JSON.stringify(value);
		} catch {
			return String(value);
		}
	}

	function yesNo(value: boolean | undefined): string {
		return value ? 'Yes' : '—';
	}

	function kindBadgeClasses(kind: string): string {
		switch (kind) {
			case 'prop':
				return 'bg-blue-50 text-blue-700 ring-blue-200';
			case 'param':
				return 'bg-violet-50 text-violet-700 ring-violet-200';
			case 'field':
				return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
			case 'method':
				return 'bg-amber-50 text-amber-700 ring-amber-200';
			default:
				return 'bg-zinc-50 text-zinc-700 ring-zinc-200';
		}
	}

	function typeBadgeClasses(type: string): string {
		switch (type) {
			case 'component':
				return 'bg-sky-50 text-sky-700 ring-sky-200';
			case 'snippet':
				return 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200';
			case 'function':
				return 'bg-green-50 text-green-700 ring-green-200';
			case 'class':
				return 'bg-orange-50 text-orange-700 ring-orange-200';
			default:
				return 'bg-zinc-50 text-zinc-700 ring-zinc-200';
		}
	}
</script>

<div class="flex flex-col gap-4 w-full">
	<div class="p-4">
		<h1 class="text-3xl font-semibold tracking-tight text-foreground">
			{api.name}
		</h1>

		{#if api.description}
			<p class="max-w-3xl text-sm leading-6 text-muted-foreground">
				{api.description}
			</p>
		{/if}
	</div>

	<div class="space-y-6">
		{#each api.items as item}
			<section class="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
				<div class="border-b border-border bg-background/70 px-6 py-5">
					<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div class="min-w-0 space-y-1">
							<div class="flex items-center gap-3">
								<h2 class="text-xl font-semibold tracking-tight text-foreground">
									{item.name}
								</h2>

								<span
									class={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${typeBadgeClasses(item.type)}`}
								>
									{item.type}
								</span>
							</div>

							{#if item.description}
								<p class="text-sm leading-6">
									{item.description}
								</p>
							{/if}
						</div>

						<div class="shrink-0 text-sm">
							{item.members.length}
							{item.members.length === 1 ? 'member' : 'members'}
						</div>
					</div>
				</div>

				{#if item.members.length > 0}
					<div class="overflow-x-auto">
						<table class="min-w-full divide-y divide-border">
							<thead class="bg-background">
								<tr class="text-left">
									<th scope="col" class="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
										Kind
									</th>
									<th scope="col" class="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
										Name
									</th>
									<th scope="col" class="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
										Type
									</th>
									<th scope="col" class="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
										Default
									</th>
									<th scope="col" class="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
										Optional
									</th>
									<th scope="col" class="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
										Bindable
									</th>
									<th scope="col" class="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
										Description
									</th>
								</tr>
							</thead>

							<tbody class="divide-y divide-border bg-background">
								{#each item.members as member}
									<tr class="align-top hover:bg-zinc-50/60">
										<td class="whitespace-nowrap px-6 py-4">
											<span
												class={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${kindBadgeClasses(member.kind)}`}
											>
												{member.kind}
											</span>
										</td>

										<td class="px-6 py-4">
											<code
												class="rounded-md bg-card-foreground px-2 py-1 text-xs font-medium text-card"
											>
												{member.key}
											</code>
										</td>

										<td class="px-6 py-4">
											<code
												class="whitespace-pre-wrap wrap-break-word rounded-md bg-card-foreground px-2 py-1 text-xs text-card"
											>
												{member.valueType}
											</code>
										</td>

										<td class="px-6 py-4 text-sm text-muted">
											{formatValue(member.defaultValue)}
										</td>

										<td class="px-6 py-4 text-sm text-muted">
											{yesNo(member.optional)}
										</td>

										<td class="px-6 py-4 text-sm text-muted">
											{yesNo(member.bindable)}
										</td>

										<td class="px-6 py-4 text-sm leading-6 text-zinc-600">
											{member.description ?? '—'}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="px-6 py-8 text-sm text-muted">No members defined.</div>
				{/if}

				{#if item.returns}
					<div class="border-t border-border bg-background px-6 py-4">
						<div class="flex flex-col gap-2 sm:flex-row sm:items-center">
							<span class="text-sm font-medium text-foreground">Returns</span>
							<code class="w-fit rounded-md bg-card-foreground px-2 py-1 text-xs text-card">
								{item.returns.valueType}
							</code>

							{#if item.returns.description}
								<span class="text-sm text-muted">
									{item.returns.description}
								</span>
							{/if}
						</div>
					</div>
				{/if}
			</section>
		{/each}
	</div>
</div>
