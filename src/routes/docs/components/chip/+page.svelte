<script lang="ts">
    import * as DocPage from '$lib/components/feature/doc-page';
    import * as Chip from '$lib/components/ui/chip';
    import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
    import { Check, Plus } from 'lucide-svelte';

    // State for toggleable chips
    let interests = $state<string[]>(['Design']);

    function toggleInterest(name: string) {
        if (interests.includes(name)) {
            interests = interests.filter(i => i !== name);
        } else {
            interests = [...interests, name];
        }
    }
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Chip</DocPage.Title>
        <DocPage.Description>
            Compact elements that represent an input, attribute, or action.
        </DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>
        <DocPage.Example>
            <DocPage.Preview class="py-10">
                <Chip.Group>
                    <Chip.Root onclick={() => alert('Clicked!')}>Action Chip</Chip.Root>
                    <Chip.Root variant="secondary">Secondary</Chip.Root>
                    <Chip.Root variant="outline">Outline</Chip.Root>
                </Chip.Group>
            </DocPage.Preview>
            <DocPage.Code code={`<Chip.Root onclick={handleClick}>Action Chip</Chip.Root>`} />
        </DocPage.Example>


        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "chip"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <DocPage.Heading>Filter / Selection</DocPage.Heading>
        <DocPage.Text>Use the `active` prop with `variant="outline"` to create toggle filters.</DocPage.Text>
        <DocPage.Example>
            <DocPage.Preview class="py-10">
                <Chip.Group>
                    {#each ['Design', 'Development', 'Marketing', 'Sales'] as label}
                        <Chip.Root
                                variant="outline"
                                active={interests.includes(label)}
                                onclick={() => toggleInterest(label)}
                        >
                            {#snippet icon()}
                                {#if interests.includes(label)}
                                    <Check class="h-3.5 w-3.5" />
                                {:else}
                                    <Plus class="h-3.5 w-3.5" />
                                {/if}
                            {/snippet}
                            {label}
                        </Chip.Root>
                    {/each}
                </Chip.Group>
            </DocPage.Preview>
            <DocPage.Code code={`<Chip.Root
  variant="outline"
  active={isSelected}
  onclick={toggle}
>
  {label}
</Chip.Root>`} />
        </DocPage.Example>

        <DocPage.Heading>With Avatar</DocPage.Heading>
        <DocPage.Example>
            <DocPage.Preview class="py-10">
                <Chip.Root variant="secondary" class="pl-1">
                    {#snippet avatar()}
                        <Avatar class="h-6 w-6">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    {/snippet}
                    @shadcn
                </Chip.Root>
            </DocPage.Preview>
        </DocPage.Example>

        <DocPage.Heading>Removable</DocPage.Heading>
        <DocPage.Example>
            <DocPage.Preview class="py-10">
                <Chip.Group>
                    <Chip.Root variant="default" removable onremove={() => alert('Remove')}>React</Chip.Root>
                    <Chip.Root variant="secondary" removable onremove={() => alert('Remove')}>Svelte</Chip.Root>
                    <Chip.Root variant="outline" removable onremove={() => alert('Remove')}>Vue</Chip.Root>
                </Chip.Group>
            </DocPage.Preview>
            <DocPage.Code code={`<Chip.Root removable onremove={handleRemove}>
  React
</Chip.Root>`} />
        </DocPage.Example>
    </DocPage.Content>
</DocPage.Root>