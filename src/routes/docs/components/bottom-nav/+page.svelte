<script lang="ts">
    import * as BottomNav from "$lib/components/ui/bottom-nav";
    import * as DocPage from "$lib/components/feature/doc-page";
    import { Home, Search, PlusCircle, Bell, User, LayoutGrid, Calendar, Mail } from "lucide-svelte";
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Bottom Navigation</DocPage.Title>
        <DocPage.Description>
            A standard mobile tab bar for main application navigation.
        </DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>

        <!-- MAIN PREVIEW -->
        <DocPage.Example>
            <!-- We simulate a mobile screen container here -->
            <DocPage.Preview class="min-h-[400px] bg-muted/20 relative overflow-hidden rounded-xl border flex items-center justify-center">

                <div class="w-[375px] h-[400px] bg-background border shadow-xl relative flex flex-col">
                    <!-- Mock Screen Content -->
                    <div class="flex-1 flex items-center justify-center text-muted-foreground bg-muted/10">
                        App Content
                    </div>

                    <!-- The Component (Pinned to bottom of this container) -->
                    <BottomNav.Root>
                        <BottomNav.Item href="#" isActive={true}>
                            <Home class="h-6 w-6" />
                            <span>Home</span>
                        </BottomNav.Item>

                        <BottomNav.Item href="#">
                            <Search class="h-6 w-6" />
                            <span>Search</span>
                        </BottomNav.Item>

                        <BottomNav.Item href="#">
                            <PlusCircle class="h-6 w-6" />
                            <span>Create</span>
                        </BottomNav.Item>

                        <BottomNav.Item href="#">
                            <Bell class="h-6 w-6" />
                            <span>Alerts</span>
                        </BottomNav.Item>

                        <BottomNav.Item href="#">
                            <User class="h-6 w-6" />
                            <span>Profile</span>
                        </BottomNav.Item>
                    </BottomNav.Root>
                </div>

            </DocPage.Preview>
            <DocPage.Code code={`<script>
  import * as BottomNav from "$lib/components/ui/bottom-nav";
</script>

<!-- Place this in your layout or page wrapper -->
<div class="fixed bottom-0 w-full">
  <BottomNav.Root>
    <BottomNav.Item href="/home">
      <Home class="h-6 w-6" />
      <span>Home</span>
    </BottomNav.Item>

    <BottomNav.Item href="/search">
      <Search class="h-6 w-6" />
      <span>Search</span>
    </BottomNav.Item>
  </BottomNav.Root>
</div>`} />
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "bottom-nav"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <!-- VARIATION: Icon Only -->
        <DocPage.Heading>Icon Only</DocPage.Heading>
        <DocPage.Text>
            You can omit the labels for a cleaner look.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="min-h-[200px] bg-muted/20 relative overflow-hidden rounded-xl border flex items-center justify-center">
                <div class="w-[375px] bg-background border shadow-xl">
                    <BottomNav.Root>
                        <BottomNav.Item href="#" isActive={true}>
                            <Mail class="h-6 w-6" />
                        </BottomNav.Item>
                        <BottomNav.Item href="#">
                            <Calendar class="h-6 w-6" />
                        </BottomNav.Item>
                        <BottomNav.Item href="#">
                            <LayoutGrid class="h-6 w-6" />
                        </BottomNav.Item>
                    </BottomNav.Root>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<BottomNav.Root>
  <BottomNav.Item href="/mail"><Mail class="h-6 w-6" /></BottomNav.Item>
  <BottomNav.Item href="/cal"><Calendar class="h-6 w-6" /></BottomNav.Item>
</BottomNav.Root>`} />
        </DocPage.Example>

    </DocPage.Content>
</DocPage.Root>