<script lang="ts">
	import type { APIRegistry } from '.';
	import { Badge } from '$lib/components/ui/badge';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	type APIItem = APIRegistry['items'][number];
	type APIMember = APIItem['members'][number];

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

	function memberName(member: APIMember): string {
		return `${member.key}${member.optional ? '?' : ''}`;
	}

	function memberRows(item: APIItem): number {
		return Math.max(item.members.length, 1);
	}

	function renderedRowCount(item: APIItem): number {
		return memberRows(item) + (item.returns ? 1 : 0);
	}

	function rowOffset(items: APIRegistry['items'], itemIndex: number): number {
		let total = 0;

		for (let i = 0; i < itemIndex; i += 1) {
			total += renderedRowCount(items[i]);
		}

		return total;
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

	function rightRowClasses(globalRowIndex: number, withTopBorder = false): string {
		const bg = globalRowIndex % 2 === 1 ? 'bg-sidebar/35' : 'bg-background';
		return withTopBorder
			? `${bg} border-t border-border transition-colors hover:bg-accent/30`
			: `${bg} transition-colors hover:bg-accent/30`;
	}
</script>

<div class="w-full overflow-x-auto bg-background text-foreground">
	<div class="mx-auto max-w-3xl py-8">
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
							class="sticky left-0 z-20 w-[200px] min-w-[200px] border-r border-border bg-sidebar px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Item
						</th>
						<th
							scope="col"
							class="min-w-[200px] bg-sidebar px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Key
						</th>
						<th
							scope="col"
							class="min-w-[220px] bg-sidebar px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Value
						</th>
						<th
							scope="col"
							class="min-w-[180px] bg-sidebar px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
						>
							Default
						</th>
					</tr>
				</thead>

				<tbody>
					{#each api.items as item, itemIndex}
						{@const startRow = rowOffset(api.items, itemIndex)}
						{@const rowSpan = memberRows(item)}

						{#if item.members.length > 0}
							{@const firstMember = item.members[0]}

							<tr class={rightRowClasses(startRow, itemIndex > 0)}>
								<td
									class={`sticky left-0 z-10 w-[200px] min-w-[200px] border-r border-border bg-sidebar px-4 py-5 align-top ${
										itemIndex > 0 ? 'border-t border-border' : ''
									}`}
									rowspan={rowSpan}
								>
									<div class="flex flex-wrap items-center gap-2">
										<h2 class="text-base font-semibold tracking-tight text-foreground">
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

								<td class="px-4 py-4 align-top">
									{#if firstMember.description}
										<Tooltip.Root>
											<Tooltip.Trigger
												class="inline-flex w-full items-start rounded-md text-left outline-none"
											>
												<span class="inline-flex flex-wrap items-center gap-2">
													<Badge
														variant="secondary"
														class={`ring-inset ring-1 ${kindBadgeClasses(firstMember.kind)}`}
													>
														{firstMember.kind}
													</Badge>

													<code
														class="rounded-md bg-background px-2 py-1 text-xs font-bold text-foreground"
													>
														{#if firstMember.bindable}
															<span class="text-emerald-600 dark:text-emerald-400">$</span>
														{/if}
														{memberName(firstMember)}
													</code>
												</span>
											</Tooltip.Trigger>

											<Tooltip.Content side="top" align="start" class="max-w-80">
												<p class="text-sm leading-5">{firstMember.description}</p>
											</Tooltip.Content>
										</Tooltip.Root>
									{:else}
										<div class="inline-flex flex-wrap items-center gap-2">
											<Badge
												variant="secondary"
												class={`ring-inset ring-1 ${kindBadgeClasses(firstMember.kind)}`}
											>
												{firstMember.kind}
											</Badge>

											<code
												class="rounded-md bg-background px-2 py-1 text-xs font-bold text-foreground"
											>
												{#if firstMember.bindable}
													<span class="text-emerald-600 dark:text-emerald-400">$</span>
												{/if}
												{memberName(firstMember)}
											</code>
										</div>
									{/if}
								</td>

								<td class="px-4 py-4 align-top">
									{#if firstMember.description}
										<Tooltip.Root>
											<Tooltip.Trigger class="inline-flex w-full rounded-md text-left outline-none">
												<code class="text-sm text-orange-500">
													{firstMember.valueType}
												</code>
											</Tooltip.Trigger>

											<Tooltip.Content side="top" align="start" class="max-w-80">
												<p class="text-sm leading-5">{firstMember.description}</p>
											</Tooltip.Content>
										</Tooltip.Root>
									{:else}
										<code class="text-sm text-orange-500">{firstMember.valueType}</code>
									{/if}
								</td>

								<td class="px-4 py-4 align-top text-sm text-muted-foreground">
									{#if firstMember.description}
										<Tooltip.Root>
											<Tooltip.Trigger class="inline-flex w-full rounded-md text-left outline-none">
												{formatValue(firstMember.defaultValue)}
											</Tooltip.Trigger>

											<Tooltip.Content side="top" align="start" class="max-w-80">
												<p class="text-sm leading-5">{firstMember.description}</p>
											</Tooltip.Content>
										</Tooltip.Root>
									{:else}
										{formatValue(firstMember.defaultValue)}
									{/if}
								</td>
							</tr>

							{#each item.members.slice(1) as member, memberIndex}
								<tr class={rightRowClasses(startRow + memberIndex + 1, true)}>
									<td class="px-4 py-4 align-top">
										{#if member.description}
											<Tooltip.Root>
												<Tooltip.Trigger
													class="inline-flex w-full items-start rounded-md text-left outline-none"
												>
													<span class="inline-flex flex-wrap items-center gap-2">
														<Badge
															variant="secondary"
															class={`ring-inset ring-1 ${kindBadgeClasses(member.kind)}`}
														>
															{member.kind}
														</Badge>

														<code
															class="rounded-md bg-background px-2 py-1 text-xs font-bold text-foreground"
														>
															{#if member.bindable}
																<span class="text-emerald-600 dark:text-emerald-400">$</span>
															{/if}
															{memberName(member)}
														</code>
													</span>
												</Tooltip.Trigger>

												<Tooltip.Content side="top" align="start" class="max-w-80">
													<p class="text-sm leading-5">{member.description}</p>
												</Tooltip.Content>
											</Tooltip.Root>
										{:else}
											<div class="inline-flex flex-wrap items-center gap-2">
												<Badge
													variant="secondary"
													class={`ring-inset ring-1 ${kindBadgeClasses(member.kind)}`}
												>
													{member.kind}
												</Badge>

												<code
													class="rounded-md bg-background px-2 py-1 text-xs font-bold text-foreground"
												>
													{#if member.bindable}
														<span class="text-emerald-600 dark:text-emerald-400">$</span>
													{/if}
													{memberName(member)}
												</code>
											</div>
										{/if}
									</td>

									<td class="px-4 py-4 align-top">
										{#if member.description}
											<Tooltip.Root>
												<Tooltip.Trigger
													class="inline-flex w-full rounded-md text-left outline-none"
												>
													<code class="text-sm text-orange-500">{member.valueType}</code>
												</Tooltip.Trigger>

												<Tooltip.Content side="top" align="start" class="max-w-80">
													<p class="text-sm leading-5">{member.description}</p>
												</Tooltip.Content>
											</Tooltip.Root>
										{:else}
											<code class="text-sm text-orange-500">{member.valueType}</code>
										{/if}
									</td>

									<td class="px-4 py-4 align-top text-sm text-muted-foreground">
										{#if member.description}
											<Tooltip.Root>
												<Tooltip.Trigger
													class="inline-flex w-full rounded-md text-left outline-none"
												>
													{formatValue(member.defaultValue)}
												</Tooltip.Trigger>

												<Tooltip.Content side="top" align="start" class="max-w-80">
													<p class="text-sm leading-5">{member.description}</p>
												</Tooltip.Content>
											</Tooltip.Root>
										{:else}
											{formatValue(member.defaultValue)}
										{/if}
									</td>
								</tr>
							{/each}
						{:else}
							<tr class={rightRowClasses(startRow, itemIndex > 0)}>
								<td
									class={`sticky left-0 z-10 w-[200px] min-w-[200px] border-r border-border bg-sidebar px-4 py-5 align-top ${
										itemIndex > 0 ? 'border-t border-border' : ''
									}`}
								>
									<div class="flex flex-wrap items-center gap-2">
										<h2 class="text-base font-semibold tracking-tight text-foreground">
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

								<td class="px-4 py-4 text-sm text-muted-foreground" colspan="3">
									No members defined.
								</td>
							</tr>
						{/if}

						{#if item.returns}
							<tr class={rightRowClasses(startRow + rowSpan, true)}>
								<td
									class="sticky left-0 z-10 w-[200px] min-w-[200px] border-r border-border bg-sidebar px-4 py-4"
								></td>

								<td class="px-4 py-4 align-top" colspan="3">
									{#if item.returns.description}
										<Tooltip.Root>
											<Tooltip.Trigger class="inline-flex w-full rounded-md text-left outline-none">
												<span class="inline-flex flex-wrap items-center gap-3">
													<span class="text-sm font-medium text-foreground">Returns</span>
													<code class="rounded-md bg-background px-2 py-1 text-xs text-primary">
														{item.returns.valueType}
													</code>
												</span>
											</Tooltip.Trigger>

											<Tooltip.Content side="top" align="start" class="max-w-80">
												<p class="text-sm leading-5">{item.returns.description}</p>
											</Tooltip.Content>
										</Tooltip.Root>
									{:else}
										<div class="inline-flex flex-wrap items-center gap-3">
											<span class="text-sm font-medium text-foreground">Returns</span>
											<code class="rounded-md bg-background px-2 py-1 text-xs text-primary">
												{item.returns.valueType}
											</code>
										</div>
									{/if}
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
