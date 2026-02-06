<script lang="ts">
    import { Walkthrough } from "$lib/components/ui/walkthrough";
    import * as DocPage from "$lib/components/feature/doc-page";
    import { Button } from "$lib/components/ui/button";
    import { Play, MousePointerClick, Paintbrush } from "lucide-svelte";

    let openTour = $state(false);
    let openCustomTour = $state(false);

    const steps = [
        {
            target: "tour-start-btn", // The button we just clicked
            title: "Welcome!",
            description: "This is a demo of the Walkthrough component. Let's explore the layout.",
            position: "bottom"
        },
        {
            target: "layout-logo", // ID from +layout.svelte
            title: "The Brand",
            description: "This component can highlight elements outside of its own component tree, like this logo in the layout.",
            position: "right"
        },
        {
            target: "layout-sidebar", // ID from +layout.svelte
            title: "Navigation Sidebar",
            description: "It handles large sections easily. Notice how the overlay creates a cutout.",
            position: "right"
        },
        {
            target: "layout-search", // ID from +layout.svelte
            title: "Global Search",
            description: "You can also target interactive elements like this search button.",
            position: "bottom"
        }
    ];

    const customSteps = [
        {
            target: "tour-custom-btn",
            title: "Custom Styles",
            description: "You can completely replace the default popover with your own snippet.",
            position: "bottom"
        },
        {
            target: "layout-logo",
            title: "Still Global",
            description: "It still works globally, just looks different!",
            position: "right"
        }
    ];
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Walkthrough</DocPage.Title>
        <DocPage.Description>
            A guided tour component that highlights elements and steps the user through features.
        </DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>
        <!-- EXAMPLE SECTION -->
        <DocPage.Example>
            <DocPage.Preview class="py-20">
                <div class="flex flex-col items-center gap-4 text-center">
                    <div class="rounded-full bg-primary/10 p-4 mb-2">
                        <MousePointerClick class="h-8 w-8 text-primary" />
                    </div>
                    <h3 class="text-2xl font-bold">Ready to explore?</h3>
                    <p class="text-muted-foreground max-w-[400px]">
                        Click the button below. The tour will escape this preview box and highlight the actual navigation sidebar and search bar of this website.
                    </p>

                    <!-- ID: tour-start-btn -->
                    <Button id="tour-start-btn" size="lg" onclick={() => openTour = true}>
                        <Play class="mr-2 h-4 w-4" /> Start Tour
                    </Button>
                </div>
            </DocPage.Preview>

            <DocPage.Code code={`<script>
  // Define IDs that exist in your +layout.svelte
  const steps = [
    { target: "layout-sidebar", title: "Sidebar", description: "...", position: "right" },
    { target: "layout-search", title: "Search", description: "...", position: "bottom" }
  ];
</script>

<Walkthrough bind:open={openTour} {steps} padding={2}/>`} />
        </DocPage.Example>


        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "walkthrough"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />

        <Walkthrough
                bind:open={openTour}
                steps={steps}
                padding={4}
        />

        <DocPage.Heading>Customization</DocPage.Heading>
        <DocPage.Text>
            You can fully replace the default popover card with your own design by passing a snippet. The context object is passed to the snippet, giving you access to controls like <code>next()</code> and <code>close()</code>.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="py-20">
                <div class="flex flex-col items-center gap-4 text-center">
                    <div class="rounded-full bg-purple-500/10 p-4 mb-2">
                        <Paintbrush class="h-8 w-8 text-purple-500" />
                    </div>
                    <h3 class="text-2xl font-bold">Fully Custom Design</h3>
                    <p class="text-muted-foreground max-w-[400px]">
                        This button triggers a tour that uses a completely custom card layout (dark mode, purple accents) instead of the default shadcn style.
                    </p>

                    <!-- ID: tour-custom-btn -->
                    <Button id="tour-custom-btn" variant="secondary" size="lg" onclick={() => openCustomTour = true}>
                        Start Custom Tour
                    </Button>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<Walkthrough bind:open={open} steps={steps}>
  {#snippet children(ctx)}
    <div class="bg-zinc-900 text-white p-6 rounded-xl border border-zinc-800">
      <h3 class="font-bold text-xl text-purple-400">
        {ctx.currentStep()?.title}
      </h3>
      <p class="text-gray-400 my-4">
        {ctx.currentStep()?.description}
      </p>
      <button onclick={ctx.next} class="bg-white text-black px-4 py-1 rounded">
        Next ->
      </button>
    </div>
  {/snippet}
</Walkthrough>`} />
        </DocPage.Example>

        <!-- CUSTOM INSTANCE -->
        <Walkthrough
                bind:open={openCustomTour}
                steps={customSteps}
        >
            {#snippet children(ctx)}
                <div class="bg-zinc-900 text-white p-6 rounded-2xl shadow-2xl w-[320px] border border-zinc-800 relative overflow-hidden">
                    <!-- Decorative blob -->
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <span class="text-xs font-mono text-purple-400 mb-1 block">STEP {ctx.currentStepIndex() + 1}</span>
                                <h3 class="font-bold text-xl tracking-tight">{ctx.currentStep()?.title}</h3>
                            </div>
                            <button onclick={ctx.close} class="text-white/40 hover:text-white transition-colors">✕</button>
                        </div>

                        <p class="text-sm text-zinc-400 mb-8 leading-relaxed">
                            {ctx.currentStep()?.description}
                        </p>

                        <div class="flex justify-between items-center">
                            <button onclick={ctx.prev} disabled={ctx.currentStepIndex() === 0} class="text-sm text-zinc-500 hover:text-white disabled:opacity-0 transition-colors">
                                Back
                            </button>

                            <button
                                    onclick={ctx.next}
                                    class="bg-white text-black hover:bg-zinc-200 font-semibold py-2 px-6 rounded-lg text-sm transition-all transform active:scale-95"
                            >
                                {ctx.isLastStep() ? 'Finish' : 'Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            {/snippet}
        </Walkthrough>
    </DocPage.Content>
</DocPage.Root>