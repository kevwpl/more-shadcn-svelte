<script lang="ts">
	import type { APIRegistry } from '.';
	import { Badge } from '$lib/components/ui/badge';

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
				return 'bg-blue-500/20 text-blue-700 dark:text-blue-100 ring-blue-700/20';
			case 'param':
				return 'bg-violet-500/20 text-violet-700 dark:text-violet-100 ring-violet-700/20';
			case 'field':
				return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-100 ring-emerald-700/20';
			case 'method':
				return 'bg-amber-500/20 text-amber-700 dark:text-amber-100 ring-amber-700/20';
			default:
				return 'bg-zinc-500/20 text-zinc-700 dark:text-zinc-100 ring-zinc-700/20';
		}
	}

	function typeBadgeClasses(type: string): string {
		switch (type) {
			case 'component':
				return 'bg-sky-500/20 text-sky-700 dark:text-sky-100 ring-sky-700/20';
			case 'snippet':
				return 'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-100 ring-fuchsia-700/20';
			case 'function':
				return 'bg-green-500/20 text-green-700 dark:text-green-100 ring-green-700/20';
			case 'class':
				return 'bg-orange-500/20 text-orange-700 dark:text-orange-100 ring-orange-700/20';
			default:
				return 'bg-zinc-500/20 text-zinc-700 dark:text-zinc-100 ring-zinc-700/20';
		}
	}

	function renderedRowCount(item: APIRegistry['items'][number]): number {
		return Math.max(item.members.length, 1) + (item.returns ? 1 : 0);
	}

	function rowOffset(items: APIRegistry['items'], itemIndex: number): number {
		let total = 0;

		for (let i = 0; i < itemIndex; i += 1) {
			total += renderedRowCount(items[i]);
		}

		return total;
	}

	function rightRowClasses(globalRowIndex: number, withTopBorder = false): string {
		const bg = globalRowIndex % 2 === 1 ? 'bg-sidebar/50' : 'bg-background';
		return withTopBorder ? `${bg} border-t border-border` : bg;
	}
</script>

<div class="w-full bg-background text-foreground">
	<div class="mx-auto max-w-7xl px-6 py-8">
		<div class="mb-8">
			<h1 class="text-3xl font-semibold tracking-tight text-foreground">
				{api.name}
			</h1>

			{#if api.description}
				<p class="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
					{api.description}
				</p>
			{/if}
		</div>

		<div class="overflow-x-auto rounded-2xl border border-border bg-background">
			<table class="min-w-full border-collapse border-spacing-0">
				<thead>
					<tr class="border-b border-border">
						<th
							scope="col"
							class="sticky left-0 w-[320px] border-r border-border bg-sidebar px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Item
						</th>
						<th
							scope="col"
							class="bg-sidebar px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Kind
						</th>
						<th
							scope="col"
							class="bg-sidebar px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Key
						</th>
						<th
							scope="col"
							class="bg-sidebar px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Value
						</th>
						<th
							scope="col"
							class="bg-sidebar px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Default
						</th>
						<th
							scope="col"
							class="bg-sidebar px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Optional
						</th>
						<th
							scope="col"
							class="bg-sidebar px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Bindable
						</th>
						<th
							scope="col"
							class="bg-sidebar px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Description
						</th>
					</tr>
				</thead>

				<tbody>
					{#each api.items as item, itemIndex}
						{@const startRow = rowOffset(api.items, itemIndex)}
						{@const totalRows = renderedRowCount(item)}

						{#if item.members.length > 0}
							<tr class={rightRowClasses(startRow, itemIndex > 0)}>
								<td
									class={`sticky left-0 w-[320px] border-r border-border bg-sidebar px-6 py-6 align-top ${
										itemIndex > 0 ? 'border-t border-border' : ''
									}`}
									rowspan={totalRows}
								>
									<div class="flex items-center gap-2">
										<h2 class="text-lg font-semibold tracking-tight text-foreground">
											{item.name}
										</h2>

										<Badge
											variant="secondary"
											class={`ring-inset ring-1 ${typeBadgeClasses(item.type)}`}
										>
											{item.type}
										</Badge>
									</div>

									{#if item.description}
										<p class="mt-2 text-sm leading-6 text-muted-foreground">
											{item.description}
										</p>
									{/if}
								</td>

								<td class="px-6 py-4 align-top">
									<Badge
										variant="secondary"
										class={`ring-inset ring-1 ${kindBadgeClasses(item.members[0].kind)}`}
									>
										{item.members[0].kind}
									</Badge>
								</td>

								<td class="px-6 py-4 align-top">
									<code
										class="rounded-md bg-background px-2 py-1 text-xs font-bold text-foreground"
									>
										{item.members[0].key}
									</code>
								</td>

								<td class="px-6 py-4 align-top">
									<code class="text-sm text-orange-500">
										{item.members[0].valueType}
									</code>
								</td>

								<td class="px-6 py-4 align-top text-sm text-muted-foreground">
									{formatValue(item.members[0].defaultValue)}
								</td>

								<td class="px-6 py-4 align-top text-sm text-muted-foreground">
									{yesNo(item.members[0].optional)}
								</td>

								<td class="px-6 py-4 align-top text-sm text-muted-foreground">
									{yesNo(item.members[0].bindable)}
								</td>

								<td class="px-6 py-4 align-top text-sm leading-6 text-muted-foreground">
									{item.members[0].description ?? '—'}
								</td>
							</tr>

							{#each item.members.slice(1) as member, memberIndex}
								<tr class={rightRowClasses(startRow + memberIndex + 1, true)}>
									<td class="px-6 py-4 align-top">
										<Badge
											variant="secondary"
											class={`ring-inset ring-1 ${kindBadgeClasses(member.kind)}`}
										>
											{member.kind}
										</Badge>
									</td>

									<td class="px-6 py-4 align-top">
										<code
											class="rounded-md bg-background px-2 py-1 text-xs font-bold text-foreground"
										>
											{member.key}
										</code>
									</td>

									<td class="px-6 py-4 align-top">
										<code class="text-sm text-orange-500">{member.valueType}</code>
									</td>

									<td class="px-6 py-4 align-top text-sm text-muted-foreground">
										{formatValue(member.defaultValue)}
									</td>

									<td class="px-6 py-4 align-top text-sm text-muted-foreground">
										{yesNo(member.optional)}
									</td>

									<td class="px-6 py-4 align-top text-sm text-muted-foreground">
										{yesNo(member.bindable)}
									</td>

									<td class="px-6 py-4 align-top text-sm leading-6 text-muted-foreground">
										{member.description ?? '—'}
									</td>
								</tr>
							{/each}
						{:else}
							<tr class={rightRowClasses(startRow, itemIndex > 0)}>
								<td
									class={`sticky left-0 z-20 w-[320px] border-r border-border bg-sidebar px-6 py-6 align-top ${
										itemIndex > 0 ? 'border-t border-border' : ''
									}`}
									rowspan={totalRows}
								>
									<div class="flex items-center gap-2">
										<h2 class="text-lg font-semibold tracking-tight text-foreground">
											{item.name}
										</h2>

										<Badge
											variant="secondary"
											class={`ring-inset ring-1 ${typeBadgeClasses(item.type)}`}
										>
											{item.type}
										</Badge>
									</div>

									{#if item.description}
										<p class="mt-2 text-sm leading-6 text-muted-foreground">
											{item.description}
										</p>
									{/if}
								</td>

								<td class="px-6 py-4 text-sm text-muted-foreground" colspan="7">
									No members defined.
								</td>
							</tr>
						{/if}

						{#if item.returns}
							<tr class={rightRowClasses(startRow + Math.max(item.members.length, 1), true)}>
								<td class="px-6 py-4 align-top" colspan="7">
									<div class="flex flex-wrap items-center gap-3">
										<span class="text-sm font-medium text-foreground">Returns</span>
										<code class="rounded-md bg-background px-2 py-1 text-xs text-primary">
											{item.returns.valueType}
										</code>

										{#if item.returns.description}
											<span class="text-sm text-muted-foreground">
												{item.returns.description}
											</span>
										{/if}
									</div>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
