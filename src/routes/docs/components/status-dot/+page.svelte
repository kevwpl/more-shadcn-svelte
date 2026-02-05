<script lang="ts">
    import * as DocPage from '$lib/components/feature/doc-page';
    import * as StatusDot from '$lib/components/ui/status-dot';
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { Badge } from '$lib/components/ui/badge';
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Status Dot</DocPage.Title>
        <DocPage.Description>
            A simple indicator for state, presence, or activity.
        </DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>
        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex items-center gap-2 py-10">
                    <div class="flex flex-col items-center gap-2">
                        <StatusDot.Root variant="default" />
                        <span class="text-xs text-muted-foreground">Default</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <StatusDot.Root variant="success" />
                        <span class="text-xs text-muted-foreground">Success</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <StatusDot.Root variant="warning" />
                        <span class="text-xs text-muted-foreground">Warning</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <StatusDot.Root variant="error" />
                        <span class="text-xs text-muted-foreground">Error</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <StatusDot.Root variant="info" />
                        <span class="text-xs text-muted-foreground">Info</span>
                    </div>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<StatusDot.Root variant="success" />`} />
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "status-dot"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <DocPage.Heading>Pulsing Animation</DocPage.Heading>
        <DocPage.Text>
            Add the `pulse` prop to draw attention to an active state.
        </DocPage.Text>
        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex items-center gap-2 py-10">
                    <div class="flex items-center gap-2 rounded-full border px-3 py-1">
                        <StatusDot.Root variant="success" pulse />
                        <span class="text-sm font-medium">All Systems Operational</span>
                    </div>

                    <div class="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 dark:border-rose-900/50 dark:bg-rose-950/30">
                        <StatusDot.Root variant="error" pulse />
                        <span class="text-sm font-medium text-rose-600 dark:text-rose-400">Live Error</span>
                    </div>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<StatusDot.Root variant="success" pulse />`} />
        </DocPage.Example>

        <DocPage.Heading>Sizes</DocPage.Heading>
        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex items-center gap-2 py-10">
                    <StatusDot.Root size="sm" variant="success" />
                    <StatusDot.Root size="md" variant="success" />
                    <StatusDot.Root size="lg" variant="success" />
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<StatusDot.Root size="sm" />
<StatusDot.Root size="md" />
<StatusDot.Root size="lg" />`} />
        </DocPage.Example>

        <DocPage.Heading>Avatar Presence</DocPage.Heading>
        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex items-center gap-2 py-10">
                    <div class="relative">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <StatusDot.Root
                                variant="success"
                                size="sm"
                                class="absolute bottom-0 right-0 ring-2 ring-background"
                        />
                    </div>

                    <div class="relative">
                        <Avatar>
                            <AvatarImage src="https://github.com/kevwpl.png" />
                            <AvatarFallback>SV</AvatarFallback>
                        </Avatar>
                        <StatusDot.Root
                                variant="warning"
                                size="sm"
                                pulse
                                class="absolute bottom-0 right-0 ring-2 ring-background"
                        />
                    </div>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<div class="relative">
  <Avatar>...</Avatar>
  <StatusDot.Root
    variant="success"
    size="sm"
    class="absolute bottom-0 right-0 ring-2 ring-background"
  />
</div>`} />
        </DocPage.Example>

        <DocPage.Heading>Table Status</DocPage.Heading>
        <DocPage.Example>
            <DocPage.Preview class="py-6">
                <div class="rounded-md border">
                    <div class="flex items-center justify-between p-3 border-b text-sm font-medium bg-muted/40 w-xs">
                        <span>Server</span>
                        <span>Status</span>
                    </div>
                    <div class="p-3 flex items-center justify-between text-sm">
                        <span>US-East-1</span>
                        <div class="flex items-center gap-2">
                            <span class="text-muted-foreground">Online</span>
                            <StatusDot.Root variant="success" size="sm" pulse />
                        </div>
                    </div>
                    <div class="p-3 border-t flex items-center justify-between text-sm bg-muted/5">
                        <span>EU-West-3</span>
                        <div class="flex items-center gap-2">
                            <span class="text-muted-foreground">Maintenance</span>
                            <StatusDot.Root variant="warning" size="sm" />
                        </div>
                    </div>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<div class="rounded-md border">
    <div class="flex items-center justify-between p-3 border-b text-sm font-medium bg-muted/40 w-xs">
        <span>Server</span>
        <span>Status</span>
    </div>
    <div class="p-3 flex items-center justify-between text-sm">
        <span>US-East-1</span>
        <div class="flex items-center gap-2">
            <span class="text-muted-foreground">Online</span>
            <StatusDot.Root variant="success" size="sm" pulse />
        </div>
    </div>
    <div class="p-3 border-t flex items-center justify-between text-sm bg-muted/5">
        <span>EU-West-3</span>
        <div class="flex items-center gap-2">
            <span class="text-muted-foreground">Maintenance</span>
            <StatusDot.Root variant="warning" size="sm" />
        </div>
    </div>
</div>`} />
        </DocPage.Example>
    </DocPage.Content>
</DocPage.Root>