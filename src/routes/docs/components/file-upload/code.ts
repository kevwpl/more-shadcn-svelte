export const code = `<script lang="ts">
import { FileUpload} from "$lib/components/ui/file-upload"
// Automatically enables multiple mode when value is an array.
// In image mode, value is the URL of the uploaded image.
let value = $state(['https://more-shadcn.noair.fun/content/finder.png', '/content/mail.png']);
let files = $state([])
</script>

try upload image
<FileUpload bind:value bind:files image/>
`;

export const codeWithSuperforms = `<script lang="ts">
const { enhance, form } = superform(...)
const files = filesProxy(form, 'image')
</script>

<form ... use:enhance>
    <FileUpload />
    <input type="hidden" name="image" bind:files={$files} />
</form>`;
