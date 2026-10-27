<script lang="ts">
	import { usePhonePicker } from '@kevwpl/svelte-o-phone';
	import * as ButtonGroup from '#lib/components/ui/button-group/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Input } from '#lib/components/ui/input/index.js';

	let {
		class: className,
		placeholder = 'Phone number',

		value = $bindable(''),
		country = $bindable('US'),
		initialValue = '',
		allowedCountries = null,
		sorting = 'alphabetic',
		customOrder = null,
		autoDetectCountry = true,
		detectInitialCountry = false,
		detectionPriority = ['language', 'ip'],
		onchange,
		...rest
	}: {
		class?: string;
		placeholder?: string;
		value?: string;
		country?: string | null;
		initialValue?: string;
		allowedCountries?: string[] | null;
		sorting?: 'alphabetic' | 'numeric' | 'custom';
		customOrder?: string[] | null;
		autoDetectCountry?: boolean;
		detectInitialCountry?: boolean;
		detectionPriority?: ('language' | 'ip')[];
		onchange?: (data: any) => void;
		[key: string]: any;
	} = $props();

	const picker = usePhonePicker({
		initialValue: initialValue || value,
		initialCountry: country || 'US',
		allowedCountries,
		sorting,
		customOrder,
		autoDetectCountry,
		detectInitialCountry,
		detectionPriority,
		onchange: (data) => {
			value = data.value;
			country = data.country;
			if (onchange) onchange(data);
		}
	});

	$effect(() => {
		if (inputElement) {
			picker.bindInput(inputElement);
			console.log('BOUND');
		}
	});

	let inputElement: HTMLInputElement | null = $state(null);
</script>

<ButtonGroup.Root>
	<Select.Root open={picker.dropdownOpen} bind:value={picker.selectedCountryCode} type="single">
		<Select.Trigger onclick={() => picker.toggleDropdown()}>
			<span>{picker.selectedCountry.flag}</span>
			<span>{picker.selectedCountry.dialCode}</span>
		</Select.Trigger>
		<Select.Content>
			{#each picker.countryList as c}
				<Select.Item
					value={c.code}
					class="flex gap-2 items-center p-2 cursor-pointer"
					onclick={() => picker.selectCountry(c)}
				>
					<span class="flag">{c.flag}</span>
					<span class="name">{c.name}</span>
					<span class="code">{c.dialCode}</span>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<Input
		bind:ref={picker.ref}
		type="tel"
		{placeholder}
		value={picker.input}
		oninput={picker.handleInput}
		aria-label="Phone number input"
	/>
</ButtonGroup.Root>
