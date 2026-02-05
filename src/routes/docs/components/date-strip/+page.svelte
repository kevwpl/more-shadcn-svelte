<script lang="ts">
    import * as DocPage from "$lib/components/feature/doc-page";
    import * as DateStrip from "$lib/components/ui/date-strip";
    import { Label } from "$lib/components/ui/label";
    import {
        today,
        getLocalTimeZone,
        isWeekend
    } from "@internationalized/date";

    // 1. Basic State
    let selectedDate = $state(today(getLocalTimeZone()));

    // 2. Custom Filter State
    let customDate = $state();
    const allowedDates = [today(getLocalTimeZone()).toString(), today(getLocalTimeZone()).add({ days: 1 }).toString()];

    function isDayDisabled(date: any) {
        return isWeekend(date, "en-US");
    }

    function isCustomDisabled(date: any) {
        const dStr = date.toString();
        return !allowedDates.includes(dStr);
    }
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Date Strip</DocPage.Title>
        <DocPage.Description>A horizontal scrollable calendar for picking specific dates.</DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>
        <DocPage.Example>
            <DocPage.Preview>
                <div class="space-y-4">
                    <Label>Pick a date</Label>
                    <DateStrip.Root bind:value={selectedDate}>
                        {#snippet children({ date })}
                            <DateStrip.Item {date} />
                        {/snippet}
                    </DateStrip.Root>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<script lang="ts">
  import { today, getLocalTimeZone } from "@internationalized/date";
  let selectedDate = $state(today(getLocalTimeZone()));
</script>

<DateStrip.Root bind:value={selectedDate}>
  {#snippet children({ date })}
    <DateStrip.Item {date} />
  {/snippet}
</DateStrip.Root>`}/>
        </DocPage.Example>


        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "date-strip"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <!-- 2. Disabled Days -->
        <DocPage.Heading>Disabled Days</DocPage.Heading>
        <DocPage.Text>Use the <code>isDateDisabled</code> prop to restrict selection (e.g. disable weekends).</DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="py-10">
                <div class="max-w-md">
                    <DateStrip.Root
                            bind:value={customDate}
                            isDateDisabled={isDayDisabled}
                    >
                        {#snippet children({ date })}
                            <DateStrip.Item {date} />
                        {/snippet}
                    </DateStrip.Root>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<script lang="ts">
  import { isWeekend } from "@internationalized/date";
</script>

<DateStrip.Root
  bind:value={customDate}
  isDateDisabled={(date) => isWeekend(date, "en-US")}
>
  {#snippet children({ date })}
    <DateStrip.Item {date} />
  {/snippet}
</DateStrip.Root>`}/>
        </DocPage.Example>

        <!-- 3. Custom Dates Only -->
        <DocPage.Heading>Specific Days Only</DocPage.Heading>
        <DocPage.Text>Combine logic to only allow specific dates from an array.</DocPage.Text>
        <DocPage.Example>
            <DocPage.Preview class="py-10">
                <div class="space-y-4">
                    <p class="text-sm text-muted-foreground">Only specific dates allowed (Today, tomorrow).</p>
                    <DateStrip.Root
                            bind:value={customDate}
                            isDateDisabled={isCustomDisabled}
                    >
                        {#snippet children({ date })}
                            <DateStrip.Item {date} />
                        {/snippet}
                    </DateStrip.Root>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<script lang="ts">
  const allowedDates = ["2025-11-24", "2025-11-26", "2025-11-28"];

  function isCustomDisabled(date) {
    return !allowedDates.includes(date.toString());
  }
</script>

<DateStrip.Root isDateDisabled={isCustomDisabled}>
  {#snippet children({ date })}
    <DateStrip.Item {date} />
  {/snippet}
</DateStrip.Root>`}/>
        </DocPage.Example>

        <!-- INSTALLATION -->
        <div class="space-y-4 pt-10">
            <h2 class="font-heading scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">Installation</h2>
            <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/date-strip.json"]} />
        </div>
    </DocPage.Content>
</DocPage.Root>