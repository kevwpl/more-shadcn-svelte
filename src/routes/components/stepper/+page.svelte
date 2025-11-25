<script lang="ts">
    import * as Stepper from "$lib/components/ui/stepper";
    import * as DocPage from "$lib/components/feature/doc-page";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Badge } from "$lib/components/ui/badge";
    import { Check, User, Mail, Shield, Circle, CheckCircle2 } from "lucide-svelte";

    // --- 1. Wizard State ---
    let currentStep = $state(0);
    let formData = $state({ email: "", password: "", fullName: "" });
    const steps = [
        { label: "Account", icon: Mail },
        { label: "Profile", icon: User },
        { label: "Review", icon: Shield }
    ];
    function next() { if (currentStep < steps.length - 1) currentStep++; }
    function prev() { if (currentStep > 0) currentStep--; }

    // --- 2. Read-only State ---
    let trackingStep = $state(2);
    const trackSteps = [
        { title: "Order Placed", date: "Mon, Aug 12" },
        { title: "Processing", date: "Tue, Aug 13" },
        { title: "Shipped", date: "Wed, Aug 14" },
        { title: "Delivered", date: "Expected Fri, Aug 16" }
    ];

    // --- 3. Vertical State ---
    let verticalStep = $state(1);
    const vertSteps = [
        { title: "Personal Info", desc: "Name, Email, Phone" },
        { title: "Account Type", desc: "Personal or Business" },
        { title: "Confirmation", desc: "Verify your details" }
    ];

    // --- 4. Customization State ---
    let customStep = $state(1);
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Stepper</DocPage.Title>
        <DocPage.Description>A visual indicator for multi-step processes.</DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>

        <!-- 1. INTERACTIVE WIZARD -->
        <DocPage.Example>
            <DocPage.Preview class="h-auto py-5">
                <div class="flex flex-col w-full max-w-lg mx-auto rounded-xl border bg-background shadow-sm">
                    <div class="p-6 border-b bg-muted/10">
                        <Stepper.Root bind:value={currentStep}>
                            {#each steps as s, i}
                                <Stepper.Item step={i}>
                                    <Stepper.Trigger step={i}>
                                        <Stepper.Indicator step={i}>
                                            {#snippet children()} <s.icon class="h-4 w-4" /> {/snippet}
                                        </Stepper.Indicator>
                                        <div class="mt-2 text-center">
                                            <Stepper.Title class="text-xs uppercase text-muted-foreground">{s.label}</Stepper.Title>
                                        </div>
                                    </Stepper.Trigger>
                                    {#if i !== steps.length - 1} <Stepper.Separator /> {/if}
                                </Stepper.Item>
                            {/each}
                        </Stepper.Root>
                    </div>

                    <div class="p-8 min-h-[300px] flex flex-col">
                        {#if currentStep === 0}
                            <div class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div class="space-y-2">
                                    <h3 class="text-lg font-medium">Create an account</h3>
                                    <p class="text-sm text-muted-foreground">Enter your email below to create your account.</p>
                                </div>
                                <div class="grid gap-4">
                                    <div class="grid gap-2">
                                        <Label for="email">Email</Label>
                                        <Input id="email" placeholder="m@example.com" bind:value={formData.email} />
                                    </div>
                                </div>
                            </div>
                        {:else if currentStep === 1}
                            <div class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div class="space-y-2">
                                    <h3 class="text-lg font-medium">Profile Info</h3>
                                    <p class="text-sm text-muted-foreground">Tell us a little bit about yourself.</p>
                                </div>
                                <div class="grid gap-4">
                                    <div class="grid gap-2">
                                        <Label for="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" bind:value={formData.fullName} />
                                    </div>
                                </div>
                            </div>
                        {:else if currentStep === 2}
                            <div class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div class="space-y-2">
                                    <h3 class="text-lg font-medium">Review details</h3>
                                    <p class="text-sm text-muted-foreground">Double check your information before submitting.</p>
                                </div>
                                <div class="rounded-lg border p-4 bg-muted/50 space-y-3 text-sm">
                                    <div class="flex justify-between"><span class="text-muted-foreground">Email:</span> <span class="font-medium">{formData.email || '—'}</span></div>
                                    <div class="flex justify-between"><span class="text-muted-foreground">Name:</span> <span class="font-medium">{formData.fullName || '—'}</span></div>
                                </div>
                            </div>
                        {/if}

                        <div class="flex items-center justify-between mt-auto pt-8">
                            <Button variant="ghost" onclick={prev} disabled={currentStep === 0}>Back</Button>
                            {#if currentStep === steps.length - 1}
                                <Button onclick={() => alert("Form Submitted!")}>Submit</Button>
                            {:else}
                                <Button onclick={next}>Next Step</Button>
                            {/if}
                        </div>
                    </div>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<Stepper.Root bind:value={currentStep}>
  {#each steps as step, i}
    <Stepper.Item step={i}>
      <Stepper.Trigger step={i}>
        <Stepper.Indicator step={i} />
        <Stepper.Title>{step.label}</Stepper.Title>
      </Stepper.Trigger>
      {#if i !== steps.length - 1}
        <Stepper.Separator />
      {/if}
    </Stepper.Item>
  {/each}
</Stepper.Root>`}/>
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "stepper"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <!-- 2. READ ONLY -->
        <DocPage.Heading>Read-only</DocPage.Heading>
        <DocPage.Text>Use the component without the <code>Trigger</code> wrapper to create status displays or tracking timelines.</DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="h-auto py-8 px-10">
                <div class="w-full space-y-8">
                    <div class="flex justify-between items-center">
                        <div>
                            <h4 class="font-bold">Order #33221</h4>
                            <p class="text-sm text-muted-foreground">Estimated Delivery: Aug 16</p>
                        </div>
                        <Badge variant="outline">Shipped</Badge>
                    </div>

                    <Stepper.Root value={trackingStep}>
                        {#each trackSteps as s, i}
                            <Stepper.Item step={i}>
                                <div class="flex flex-col items-center text-center gap-2">
                                    <Stepper.Indicator step={i} class="h-8 w-8 text-xs" />
                                    <div class="flex flex-col gap-0.5">
                                        <span class="text-xs font-medium">{s.title}</span>
                                        <span class="text-[10px] text-muted-foreground">{s.date}</span>
                                    </div>
                                </div>
                                {#if i !== trackSteps.length - 1} <Stepper.Separator class="-mt-8" /> {/if}
                            </Stepper.Item>
                        {/each}
                    </Stepper.Root>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<Stepper.Root value={2}>
  <Stepper.Item step={0}>
    <!-- Using a div instead of Stepper.Trigger makes it static -->
    <div class="flex flex-col items-center">
      <Stepper.Indicator step={0} />
      <span>Order Placed</span>
    </div>
    <Stepper.Separator />
  </Stepper.Item>
</Stepper.Root>`}/>
        </DocPage.Example>

        <!-- 3. VERTICAL -->
        <DocPage.Heading>Vertical Orientation</DocPage.Heading>
        <DocPage.Text>
            Use the <code>orientation="vertical"</code> prop. The components will automatically adjust their layout and separator alignment.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="h-[350px] flex items-center justify-center p-6">
                <div class="w-full max-w-xs">
                    <Stepper.Root bind:value={verticalStep} orientation="vertical" class="h-[250px]">
                        {#each vertSteps as s, i}
                            <Stepper.Item step={i}>
                                <Stepper.Trigger step={i}>
                                    <Stepper.Indicator step={i} />
                                    <div class="flex flex-col items-start text-left">
                                        <Stepper.Title>{s.title}</Stepper.Title>
                                        <Stepper.Description>{s.desc}</Stepper.Description>
                                    </div>
                                </Stepper.Trigger>
                                {#if i !== vertSteps.length - 1} <Stepper.Separator /> {/if}
                            </Stepper.Item>
                        {/each}
                    </Stepper.Root>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<Stepper.Root orientation="vertical">
   {#each steps as s, i}
      <Stepper.Item step={i}>
         <Stepper.Trigger step={i}>
            <Stepper.Indicator step={i} />
            <div class="flex flex-col items-start">
               <Stepper.Title>{s.title}</Stepper.Title>
               <Stepper.Description>{s.desc}</Stepper.Description>
            </div>
         </Stepper.Trigger>
         <Stepper.Separator />
      </Stepper.Item>
   {/each}
</Stepper.Root>`}/>
        </DocPage.Example>

        <!-- 4. CUSTOMIZATION -->
        <DocPage.Heading>Customization</DocPage.Heading>
        <DocPage.Text>
            You can customize the <code>Indicator</code> content using snippets.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="h-auto py-10">
                <div class="w-full max-w-xl">
                    <Stepper.Root bind:value={customStep}>
                        {#each ["One", "Two", "Three"] as label, i}
                            <Stepper.Item step={i}>
                                <Stepper.Trigger step={i}>
                                    <Stepper.Indicator step={i} class="h-12 w-12 rounded-lg">
                                        {#snippet children()}
                                            <Circle class="h-4 w-4" />
                                        {/snippet}
                                        {#snippet success()}
                                            <CheckCircle2 class="h-5 w-5" />
                                        {/snippet}
                                    </Stepper.Indicator>
                                    <div class="mt-2 text-center">
                                        <Stepper.Title>{label}</Stepper.Title>
                                    </div>
                                </Stepper.Trigger>
                                {#if i !== 2} <Stepper.Separator /> {/if}
                            </Stepper.Item>
                        {/each}
                    </Stepper.Root>

                    <div class="flex justify-center mt-8 gap-4">
                        <Button variant="outline" size="sm" onclick={() => customStep = Math.max(0, customStep - 1)}>Prev</Button>
                        <Button variant="outline" size="sm" onclick={() => customStep = Math.min(2, customStep + 1)}>Next</Button>
                    </div>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<Stepper.Indicator step={i} class="h-12 w-12 rounded-lg">
  {#snippet children()} <Circle /> {/snippet}
  {#snippet success()} <CheckCircle2 /> {/snippet}
</Stepper.Indicator>`}/>
        </DocPage.Example>

    </DocPage.Content>
</DocPage.Root>
