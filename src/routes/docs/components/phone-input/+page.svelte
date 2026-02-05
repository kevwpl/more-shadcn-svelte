<script lang="ts">
    import { PhoneInput } from "$lib/components/ui/phone-input";
    import * as DocPage from "$lib/components/feature/doc-page";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";

    let phoneBasic = $state("");

    let phoneRestricted = $state("");
    let countryRestricted = $state("DE");

    let phoneValid = $state("");
    let isValid = $state(false);
    let metaData = $state<any>(null);
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Phone Input</DocPage.Title>
        <DocPage.Description>
            An international phone number input with country selector, formatting, and validation.
        </DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>

        <!-- 1. BASIC USAGE -->
        <DocPage.Example>
            <DocPage.Preview class="flex flex-col items-center justify-center min-h-[200px] gap-4">
                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Default Configuration</Label>
                    <PhoneInput bind:value={phoneBasic} />
                    <p class="text-xs text-muted-foreground">Value: {phoneBasic || '-'}</p>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<script>
  let phone = $state("");
</script>

<PhoneInput bind:value={phone} />`} />
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "phone-input"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <!-- 2. RESTRICTED & SORTED -->
        <DocPage.Heading>Restricted Countries</DocPage.Heading>
        <DocPage.Text>
            You can limit the available countries and change the sort order (e.g., by dial code).
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="flex items-center justify-center min-h-[200px]">
                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label>North America & Europe Only</Label>
                    <PhoneInput
                            bind:value={phoneRestricted}
                            bind:country={countryRestricted}
                            sorting="numeric"
                            allowedCountries={['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'AT']}
                    />
                </div>
            </DocPage.Preview>

            <DocPage.Code code={`<PhoneInput
  bind:country={country}
  sorting="numeric"
  allowedCountries={['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'AT']}
/>`} />
        </DocPage.Example>

        <!-- 3. VALIDATION -->
        <DocPage.Heading>Validation & Formatting</DocPage.Heading>
        <DocPage.Text>
            Use the <code>onchange</code> callback to get validity state and metadata.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="flex items-center justify-center min-h-[250px]">
                <div class="grid w-full max-w-sm items-center gap-4">
                    <div class="grid gap-1.5">
                        <Label>Enter a valid number</Label>
                        <PhoneInput
                                bind:value={phoneValid}
                                onchange={(data) => {
                                isValid = data.valid;
                                metaData = data;
                            }}
                        />
                    </div>

                    <div class="rounded-md bg-muted p-4 text-sm grid gap-2">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Valid:</span>
                            <span class={isValid ? "text-emerald-500 font-bold" : "text-destructive font-bold"}>
                                {isValid ? "YES" : "NO"}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Country:</span>
                            <span>{metaData?.country || '-'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">E.164:</span>
                            <span class="font-mono">{metaData?.value || '-'}</span>
                        </div>
                    </div>
                </div>
            </DocPage.Preview>

            <DocPage.Code code={`<PhoneInput
  onchange={(data) => {
    console.log(data.valid); // true/false
    console.log(data.value); // E.164 format
    console.log(data.country); // ISO code
  }}
/>`} />
        </DocPage.Example>

    </DocPage.Content>
</DocPage.Root>