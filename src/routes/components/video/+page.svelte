<script lang="ts">

import {Video} from "$lib/components/ui/video";
import * as DocPage from "$lib/components/feature/doc-page";
</script>

<DocPage.Root>
    <DocPage.Header>
        <DocPage.Title>Video</DocPage.Title>
        <DocPage.Description>A custom video player.</DocPage.Description>
    </DocPage.Header>
    <DocPage.Content>
        <DocPage.Example>
            <DocPage.Preview>
                <div class="flex justify-center w-full p-12">
                    <Video src="/content/pluribus_trailer.mp4" poster="/content/pluribus_thumbnail.jpg"/>
                </div>
            </DocPage.Preview>
            <DocPage.Code code={`<Video
    src="/content/video.mp4"
    poster="/content/thumbnail.jpg"
    autoplay
    muted
    loop
/>`} />
        </DocPage.Example>

        <DocPage.Heading>Installation</DocPage.Heading>
        {@const componentName = "video"}
        <DocPage.Text>Run the following command to install the `{componentName}` components:</DocPage.Text>
        <DocPage.PM command="execute" args={["shadcn-svelte@latest", "add", "https://more-shadcn.noair.fun/r/" + componentName + ".json"]} />

    </DocPage.Content>
</DocPage.Root>
