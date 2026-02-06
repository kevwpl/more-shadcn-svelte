<script lang="ts">
    import * as DocPage from "$lib/components/feature/doc-page";
    import * as ColorPicker from "$lib/components/ui/color-picker";
    import * as Popover from "$lib/components/ui/popover";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import { Paintbrush } from "lucide-svelte";

    let color = $state("#FF0000");
    let alphaColor = $state("rgba(66, 235, 120, 0.5)");
    let popoverColor = $state("#3b82f6");
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Color Picker</DocPage.Title>
        <DocPage.Description>
            A professional-grade color picker with alpha channel, format switching, and text inputs.
        </DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>
        <DocPage.Example>
            <DocPage.Preview class="py-10 flex flex-col items-center gap-4">
                <ColorPicker.Root bind:value={color} formats={["hex"]}/>
            </DocPage.Preview>
            <DocPage.Code code={`<ColorPicker.Root bind:value={color} />`} />
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "color-picker"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />




        <DocPage.Heading>Transparency & RGB</DocPage.Heading>
        <DocPage.Text>
            When <code>allowOpacity</code> is enabled, the picker adds an alpha slider and percentage input.
            Changing the format in the UI updates the output string style.
        </DocPage.Text>
        <DocPage.Example>
            <DocPage.Preview class="py-10 flex flex-col items-center gap-4">
                <ColorPicker.Root
                        bind:value={alphaColor}
                        allowOpacity={true}
                        defaultFormat="rgb"
                />
            </DocPage.Preview>
            <DocPage.Code code={`<ColorPicker.Root
  bind:value={alphaColor}
  allowOpacity={true}
  defaultFormat="rgb"
/>`} />
        </DocPage.Example>

        <DocPage.Heading>Within Popover</DocPage.Heading>
        <DocPage.Text>
            The color picker works seamlessly inside popovers or dialogs.
        </DocPage.Text>
        <DocPage.Example>
            <DocPage.Preview class="py-10 flex flex-col items-center gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-full border shadow-sm" style:background-color={popoverColor}></div>
                    <Popover.Root>
                        <Popover.Trigger>
                            {#snippet child({ props })}
                                <Button {...props} variant="outline" class="w-[220px] justify-start text-left font-normal">
                                    <Paintbrush class="mr-2 h-4 w-4" />
                                    {popoverColor}
                                </Button>
                            {/snippet}
                        </Popover.Trigger>
                        <Popover.Content class="w-auto p-0 border-none shadow-none">
                                <ColorPicker.Root bind:value={popoverColor} />
                        </Popover.Content>
                    </Popover.Root>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
        <Button {...props} variant="outline">
            {popoverColor}
        </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <div class="p-3">
      <ColorPicker.Root bind:value={popoverColor} />
    </div>
  </Popover.Content>
</Popover.Root>`} />
        </DocPage.Example>
    </DocPage.Content>
</DocPage.Root>