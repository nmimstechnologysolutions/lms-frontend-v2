<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import { Button, Input, Textarea, Fileupload, Checkbox, Radio, Toggle } from 'flowbite-svelte';
	import Select from '$lib/components/form/Select.svelte';
	import Multiselect from '$lib/components/form/Multiselect.svelte';

	function handleSubmit(e) {
		console.log('Form Submitted');
		const formData = new FormData(e.target);
		console.log('formData:::::::::', ...formData);
		const json = Object.fromEntries(formData);
		console.log('json:::::::::', json);
	}

	let multipleSelect;
</script>

<form
	on:submit|preventDefault={handleSubmit}
	class="flex flex-col gap-8 w-[85%] max-w-[1100px] mx-auto"
>
	<FormCard class="form">
		<svelte:fragment slot="heading">First Card</svelte:fragment>
		<InputGroup label="Label">
			<Input type="text" placeholder="Enter Your Name" />
		</InputGroup>
		<InputGroup label="Label">
			<Input type="text" placeholder="Enter Your Name" />
		</InputGroup>
		<InputGroup label="Label">
			<Input type="text" placeholder="Enter Your Name" />
		</InputGroup>
		<InputGroup label="Label">
			<Input type="text" placeholder="Enter Your Name" />
		</InputGroup>
		<InputGroup label="Label">
			<Input type="text" placeholder="Enter Your Name" />
		</InputGroup>
		<InputGroup>
			<div class="flex gap-4 items-center">
				<Radio name="rad" value="1">Radio 1</Radio>
				<Radio name="rad" value="2">Radio 2</Radio>
			</div>
		</InputGroup>
		<InputGroup>
			<Checkbox name="chechbox" value="true">Default checkbox</Checkbox>
		</InputGroup>
		<InputGroup>
			<Toggle name="toggle">Toggle Me</Toggle>
		</InputGroup>
	</FormCard>

	<FormCard class="form">
		<svelte:fragment slot="heading">Second Card</svelte:fragment>
		<InputGroup label="Label">
			<Input type="text" placeholder="Enter Your Name" />
		</InputGroup>
		<InputGroup label="Label">
			<Fileupload />
		</InputGroup>
		<InputGroup label="Start Date">
			<Input type="datetime-local" />
		</InputGroup>
		<InputGroup label="End Date">
			<Input type="date" />
		</InputGroup>
		<InputGroup label="Label">
			<Select name="select" placeholder="Select Name" />
		</InputGroup>
		<InputGroup label="Label">
			<Multiselect bind:value={multipleSelect}>
				<option value="AF">Afrikanns</option>
				<option value="SQ">Albanian</option>
				<option value="AR">Arabic</option>
				<option value="HY">Armenian</option>
				<option value="EU">Basque</option>
				<option value="BN" selected>Bengali</option>
				<option value="BG">Bulgarian</option>
				<option value="CA">Catalan</option>
				<option value="KM">Cambodian</option>
				<option value="ZH">Chinese (Mandarin)</option>
				<option value="HR">Croation</option>
				<option value="CS">Czech</option>
			</Multiselect>
		</InputGroup>
	</FormCard>

	<FormCard class="form">
		<svelte:fragment slot="heading">Third Card</svelte:fragment>
		<InputGroup label="Label" class="col-span-full">
			<Textarea rows="4" placeholder="Enter Your Name" />
		</InputGroup>
	</FormCard>

	<Button type="submit">Submit</Button>
</form>
