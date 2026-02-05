<script lang="ts">
    import { NumberTicker } from "$lib/components/ui/number-ticker";
    import * as DocPage from "$lib/components/feature/doc-page";
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { DollarSign, Users, ArrowUpRight, Activity } from "lucide-svelte";

    // Simple reload hack to replay animation
    let uniqueKey = $state(0);
    function replay() {
        uniqueKey++;
    }
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Number Ticker</DocPage.Title>
        <DocPage.Description>
            An animated number that counts up with a spring physics effect when scrolled into view.
        </DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>

        <!-- MAIN PREVIEW -->
        <DocPage.Example>
            <DocPage.Preview>
                {#key uniqueKey}
                    <div class="flex flex-col items-center justify-center gap-4 min-h-[200px]">
                        <p class="text-sm text-muted-foreground uppercase tracking-widest">Total Revenue</p>
                        <div class="text-7xl font-bold tracking-tighter flex items-baseline">
                            $ <NumberTicker value={52342} class="ml-2" />
                        </div>
                        <Button variant="outline" size="sm" onclick={replay} class="mt-8">
                            Replay Animation
                        </Button>
                    </div>
                {/key}
            </DocPage.Preview>
            <DocPage.Code code={`<div class="text-7xl font-bold">
  $ <NumberTicker value={52342} />
</div>`} />
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "number-ticker"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <!-- USE CASES -->
        <DocPage.Heading>Dashboard Stats</DocPage.Heading>
        <DocPage.Text>
            Perfect for KPI cards to make data feel "live" and impactful.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="bg-muted/20 p-8">
                {#key uniqueKey}
                    <div class="grid gap-4 md:grid-cols-3 w-full">
                        <!-- Card 1 -->
                        <Card.Root>
                            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
                                <DollarSign class="h-4 w-4 text-muted-foreground" />
                            </Card.Header>
                            <Card.Content>
                                <div class="text-2xl font-bold">
                                    $<NumberTicker value={45231} />
                                </div>
                                <p class="text-xs text-muted-foreground flex items-center pt-1 text-emerald-500">
                                    <ArrowUpRight class="h-4 w-4 mr-1" /> +20.1%
                                </p>
                            </Card.Content>
                        </Card.Root>

                        <!-- Card 2 -->
                        <Card.Root>
                            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Card.Title class="text-sm font-medium">Active Users</Card.Title>
                                <Users class="h-4 w-4 text-muted-foreground" />
                            </Card.Header>
                            <Card.Content>
                                <div class="text-2xl font-bold">
                                    +<NumberTicker value={2350} />
                                </div>
                                <p class="text-xs text-muted-foreground pt-1">
                                    +180 since last hour
                                </p>
                            </Card.Content>
                        </Card.Root>

                        <!-- Card 3 -->
                        <Card.Root>
                            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Card.Title class="text-sm font-medium">Requests</Card.Title>
                                <Activity class="h-4 w-4 text-muted-foreground" />
                            </Card.Header>
                            <Card.Content>
                                <div class="text-2xl font-bold">
                                    <NumberTicker value={12234} />
                                </div>
                                <p class="text-xs text-muted-foreground pt-1">
                                    Requests per second
                                </p>
                            </Card.Content>
                        </Card.Root>
                    </div>
                {/key}
            </DocPage.Preview>
            <DocPage.Code code={`<NumberTicker value={45231} />`} />
        </DocPage.Example>

        <!-- CUSTOM STYLING -->
        <DocPage.Heading>Styling</DocPage.Heading>
        <DocPage.Text>
            The component renders a simple <code>span</code> so it inherits font size, color, and weight from its parent or the <code>class</code> prop.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview>
                {#key uniqueKey}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                        <div>
                            <p class="text-sm text-muted-foreground mb-3">Gradient Text</p>
                            <NumberTicker
                                    value={100}
                                    class="text-6xl font-black bg-gradient-to-r from-yellow-600 to-purple-600 text-transparent bg-clip-text"
                            />
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground mb-2">Monospace / Code</p>
                            <div class="font-mono text-4xl bg-zinc-900 text-green-400 p-4 rounded-md inline-block">
                                &gt; <NumberTicker value={9999} class="text-green-400"/>_
                            </div>
                        </div>
                    </div>
                {/key}
            </DocPage.Preview>
            <DocPage.Code code={`<!-- Gradient -->
<NumberTicker
  value={100}
  class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
/>

<!-- Monospace -->
<div class="font-mono text-green-400">
  <NumberTicker value={9999} class="text-green-400"/>
</div>`} />
        </DocPage.Example>
    </DocPage.Content>
</DocPage.Root>