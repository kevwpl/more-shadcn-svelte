<script lang="ts">
    import * as ImageZoom from "$lib/components/ui/image-zoom";
    import * as DocPage from "$lib/components/feature/doc-page";
    import { Separator } from "$lib/components/ui/separator";

    const images = [
        {
            src: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
            alt: "A scenic view of mountains and a lake."
        },
        {
            src: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "A person riding a motorcycle."
        },
        {
            src: "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "A modern building."
        }
    ];
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Image Zoom</DocPage.Title>
        <DocPage.Description>
            A component that allows users to click an image to view a larger, centered version in a full-screen overlay, with gallery navigation.
        </DocPage.Description>
    </DocPage.Header>

    <DocPage.Content>

        <!-- MAIN PREVIEW -->
        <DocPage.Example>
            <DocPage.Preview class="flex items-center justify-center min-h-[400px]">
                <ImageZoom.Root>
                        <div class="overflow-hidden rounded-lg shadow-lg">
                            <ImageZoom.Trigger
                                    src="https://images.unsplash.com/photo-1587750059638-e7e8c43b99fc?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="An old-school car."
                                    class="w-full h-48 object-cover"
                            />
                        </div>
                </ImageZoom.Root>
            </DocPage.Preview>
            <DocPage.Code code={`<ImageZoom.Root>
  <ImageZoom.Trigger
    src="your-image-1.jpg"
    alt="Description 1"
  />
</ImageZoom.Root>`} />
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "image-zoom"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />


        <DocPage.Heading>Gallery View</DocPage.Heading>
        <DocPage.Text>
            Integrate multiple `ImageZoom.Trigger` components into a gallery or album layout to enable full-screen browsing.
        </DocPage.Text>

        <DocPage.Example>
            <DocPage.Preview class="min-h-[300px] flex justify-center items-center">
                <ImageZoom.Root>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                        {#each images as img}
                            <div class="overflow-hidden rounded-lg shadow-lg">
                                <ImageZoom.Trigger
                                        src={img.src}
                                        alt={img.alt}
                                        class="w-full h-48 object-cover"
                                />
                            </div>
                        {/each}
                    </div>
                </ImageZoom.Root>
            </DocPage.Preview>
            <DocPage.Code code={`<ImageZoom.Root>
  {#each albumImages as img}
    <ImageZoom.Trigger {img.src} {img.alt} />
  {/each}
</ImageZoom.Root>`} />
        </DocPage.Example>

    </DocPage.Content>
</DocPage.Root>