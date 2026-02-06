<script lang="ts">
    import { ShinyButton } from "$lib/components/ui/shiny-button";
    import * as DocPage from "$lib/components/feature/doc-page";
    import { ArrowRight, Trash, Github, Sparkle, Mail } from "lucide-svelte";
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Shiny Button</DocPage.Title>
        <DocPage.Description>A button that draws attention with a moving light reflection effect.</DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>
        <!-- MAIN PREVIEW -->
        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex items-center justify-center min-h-[250px]">
                    <ShinyButton>
                        Join Waitlist
                        <ArrowRight class="ml-2 h-4 w-4" />
                    </ShinyButton>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<ShinyButton>
  Join Waitlist
  <ArrowRight class="ml-2 h-4 w-4" />
</ShinyButton>`} />
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "shiny-button"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <!-- VARIANTS -->
        <DocPage.Heading>Variants</DocPage.Heading>
        <DocPage.Text>
            Since this wraps the standard Shadcn <code>Button</code>, all your existing variants work automatically. The shine effect adjusts to the button's bounds.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex flex-wrap gap-4 items-center justify-center min-h-[150px] p-10">
                    <ShinyButton variant="default">Default</ShinyButton>
                    <ShinyButton variant="secondary">Secondary</ShinyButton>
                    <ShinyButton variant="destructive">
                        <Trash class="mr-2 h-4 w-4" /> Delete
                    </ShinyButton>
                    <ShinyButton variant="outline">Outline</ShinyButton>
                    <ShinyButton variant="ghost">Ghost</ShinyButton>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<ShinyButton variant="default">Default</ShinyButton>
<ShinyButton variant="secondary">Secondary</ShinyButton>
<ShinyButton variant="destructive">Destructive</ShinyButton>
<ShinyButton variant="outline">Outline</ShinyButton>
<ShinyButton variant="ghost">Ghost</ShinyButton>`} />
        </DocPage.Example>

        <!-- SIZES -->
        <DocPage.Heading>Sizes</DocPage.Heading>
        <DocPage.Text>Supports standard sizes: sm, default, lg, and icon.</DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex flex-wrap items-center justify-center gap-4 min-h-[150px] p-10">
                    <ShinyButton size="sm">Small</ShinyButton>
                    <ShinyButton size="default">Default</ShinyButton>
                    <ShinyButton size="lg">Large</ShinyButton>
                    <ShinyButton size="icon" variant="secondary">
                        <Github class="h-4 w-4" />
                    </ShinyButton>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<ShinyButton size="sm">Small</ShinyButton>
<ShinyButton size="default">Default</ShinyButton>
<ShinyButton size="lg">Large</ShinyButton>
<ShinyButton size="icon"><Github /></ShinyButton>`} />
        </DocPage.Example>
    </DocPage.Content>
</DocPage.Root>