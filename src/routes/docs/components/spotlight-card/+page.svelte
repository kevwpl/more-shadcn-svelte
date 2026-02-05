<script lang="ts">
    import { SpotlightCard } from "$lib/components/ui/spotlight-card";
    import * as DocPage from "$lib/components/feature/doc-page";
    import { Zap, Shield, Rocket, Palette, MousePointer2, Sparkle } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Spotlight Card</DocPage.Title>
        <DocPage.Description>A card component that reveals a radial gradient background as you hover over it.</DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>
        <!-- MAIN PREVIEW -->
        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex flex-col md:flex-row gap-4 p-8 max-w-4xl w-full justify-center">
                    <SpotlightCard class="max-w-sm p-6 flex flex-col gap-3">
                        <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                            <Zap class="h-5 w-5" />
                        </div>
                        <h3 class="font-semibold text-xl">Lightning Fast</h3>
                        <p class="text-muted-foreground text-sm">
                            Experience zero latency with our edge network optimized for speed.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard class="max-w-sm p-6 flex flex-col gap-3">
                        <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                            <Shield class="h-5 w-5" />
                        </div>
                        <h3 class="font-semibold text-xl">Secure</h3>
                        <p class="text-muted-foreground text-sm">
                            Enterprise-grade security out of the box. No configuration needed.
                        </p>
                    </SpotlightCard>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<SpotlightCard class="p-6">
  <Zap />
  <h3>Title</h3>
  <p>Description...</p>
</SpotlightCard>`} />
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "spotlight-card"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <!-- CUSTOM COLORS -->
        <DocPage.Heading>Custom Colors</DocPage.Heading>
        <DocPage.Text>
            You can change the spotlight color by passing any valid CSS color string to the <code>color</code> prop. Using specific <code>rgba</code> values gives the best control over opacity.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 w-full">
                    <!-- Red-500 with 0.15 opacity -->
                    <SpotlightCard class="p-6 flex flex-col gap-2 text-center items-center justify-center" color="rgba(239, 68, 68, 0.15)">
                        <div class="text-red-500"><Palette class="h-6 w-6"/></div>
                        <span class="font-medium">Red Spotlight</span>
                    </SpotlightCard>

                    <!-- Blue-500 with 0.15 opacity -->
                    <SpotlightCard class="p-6 flex flex-col gap-2 text-center items-center" color="rgba(59, 130, 246, 0.15)">
                        <div class="text-blue-500"><Palette class="h-6 w-6"/></div>
                        <span class="font-medium">Blue Spotlight</span>
                    </SpotlightCard>

                    <!-- Emerald-500 with 0.15 opacity -->
                    <SpotlightCard class="p-6 flex flex-col gap-2 text-center items-center" color="rgba(16, 185, 129, 0.15)">
                        <div class="text-emerald-500"><Palette class="h-6 w-6"/></div>
                        <span class="font-medium">Emerald Spotlight</span>
                    </SpotlightCard>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<SpotlightCard color="rgba(239, 68, 68, 0.15)">...</SpotlightCard>
<SpotlightCard color="rgba(59, 130, 246, 0.15)">...</SpotlightCard>
<SpotlightCard color="rgba(16, 185, 129, 0.15)">...</SpotlightCard>`} />
        </DocPage.Example>

        <!-- THEME COLORS -->
        <DocPage.Heading>Using Theme Colors</DocPage.Heading>
        <DocPage.Text>
            To use your Tailwind theme variables (like <code>--primary</code>), you can use the CSS <code>hsl()</code> syntax.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex justify-center p-8 w-full">
                    <SpotlightCard class="p-6 flex flex-col gap-3 max-w-sm w-full" color="hsl(var(--primary) / 0.2)">
                        <h3 class="font-semibold text-xl text-primary">Brand Primary</h3>
                        <p class="text-muted-foreground text-sm">
                            This spotlight uses your configured primary color automatically.
                        </p>
                    </SpotlightCard>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<SpotlightCard color="hsl(var(--primary) / 0.2)">
  <!-- Content -->
</SpotlightCard>`} />
        </DocPage.Example>

        <!-- CUSTOM SIZE -->
        <DocPage.Heading>Spotlight Size</DocPage.Heading>
        <DocPage.Text>
            Adjust the <code>size</code> prop to control the pixel radius of the spotlight effect.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 w-full max-w-3xl">
                    <SpotlightCard class="p-8 text-center" size={100}>
                        <h4 class="font-bold mb-2">Small Spotlight (100px)</h4>
                        <p class="text-xs text-muted-foreground">Good for small interactive elements</p>
                    </SpotlightCard>

                    <SpotlightCard class="p-8 text-center" size={600}>
                        <h4 class="font-bold mb-2">Large Spotlight (600px)</h4>
                        <p class="text-xs text-muted-foreground">Good for hero sections or large panels</p>
                    </SpotlightCard>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<SpotlightCard size={100}>...</SpotlightCard>
<SpotlightCard size={600}>...</SpotlightCard>`} />
        </DocPage.Example>
    </DocPage.Content>
</DocPage.Root>