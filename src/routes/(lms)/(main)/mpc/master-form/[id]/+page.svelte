<script lang="ts">
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import { Button, Input, Textarea } from 'flowbite-svelte';
	import Select from '$lib/components/form/Select.svelte';
	import { onMount } from 'svelte';
	import MultiSelect from '$lib/components/form/MultiSelect.svelte';
	import { showConfirmation } from '$lib/components/modals/Confirm.svelte';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import type { Options } from '$lib/types/form.js';
	import type { MasterFormUserResponse } from '$lib/types/mpc.js';
	import { addToast } from '$lib/stores/toast-store.js';
	import type { FetchResponse } from '$lib/types/response.js';
	import { validateMasterFormEdit } from '$lib/utils/validations/mpc.validation.js';
	import { goto } from '$app/navigation';

	export let data;

	$: masterData = data.masterData;

	let form: HTMLFormElement;
	let programAnchorSelect: Options[] = [];
	let programAnchorValue: (string | number)[] = [];
	let courseAnchorSelect: Options[] = [];
	let courseAnchorValue: (string | number)[] = [];
	let attendeesSelect: Options[] = [];
	let attendeesValue: (string | number)[] = [];

	async function handleSubmit(e: Event, isFinalSubmit: boolean) {
		e.preventDefault()

		const text = isFinalSubmit ? "submit" : "save as draft";
		const confirmed = await showConfirmation(`Are you sure you want to ${text} this form?`); 

		if(!confirmed) return;

		const formData = new FormData(form);

		let data = Object.fromEntries(formData) as any;
		data = {
			...data,
			program_anchor: programAnchorValue,
			course_anchor: courseAnchorValue,
			attendees: attendeesValue,
			meeting_id: masterData.meeting_id,
			is_final_submit: isFinalSubmit
		};
		
		const validated = validateMasterFormEdit(data)

		if(!validated) return;

		const { error, json } = await fetchApi<FetchResponse>(`${PUBLIC_FETCH_BASE_URL}/mpc/api/master-form`, 'PUT', data);

		if (error) {
			console.log(error);
			addToast({
				color: 'red',
				heading: error.status,
				message: error.message,
				position: 'bottom-right',
				error: true,
				errorId: error.errorId
			});
			return;
		}

		addToast({
			color: 'green',
			heading: json.status,
			message: isFinalSubmit ? 'Master form Submitted Successfully' : 'Master form Saved as Draft Successfully',
			position: 'bottom-right',
			error: false
		});

		goto('/mpc/view-master-form')

	}

	async function handleAcadSession() {
		const { error, json } = await fetchApi<MasterFormUserResponse>(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/users-for-master-form-edit?masterFormId=${masterData.meeting_id}`,
			'GET'
		);

		if(!json || error) {
			programAnchorSelect = [];
			courseAnchorSelect = [];
			attendeesSelect = [];
			return;
		}

		programAnchorSelect = json.program_anchor || [];
		courseAnchorSelect = json.course_anchor || [];
		attendeesSelect = json.attendees || [];
	}
	onMount(() => {
		handleAcadSession();
	});

</script>

<form
	class="flex flex-col gap-4 w-[85%] max-w-[1100px] mx-auto"
	bind:this={form}
>
	<FormCard class="form">
		<svelte:fragment slot="heading">Edit Meeting</svelte:fragment>
		<InputGroup label="Acad Year">
			<Input
				value={masterData.acad_year}
				name="acad_year"
				placeholder="Select Acad Year"
				disabled
			/>
		</InputGroup>
		<InputGroup label="Program">
			<Input
				value={`${masterData.program_name} (${masterData.program_code}) - ${masterData.program_id}`}
				disabled
				placeholder="Select Program"
			/>
		</InputGroup>
		<InputGroup label="Course">
			<Input
				value={`${masterData.subject_name} (${masterData.subject_abbr}) - ${masterData.subject_id}`}
				disabled
				placeholder="Select Course"
			/>
		</InputGroup>
		<InputGroup label="Acad Session">
			<Input
				value={masterData.acad_session}
				disabled
				name="acad_session"
				placeholder="Select Acad Session"
			/>
		</InputGroup>
		<InputGroup isRequired label="Program Anchor / Program Chair">
			<MultiSelect options={programAnchorSelect} bind:value={programAnchorValue} placeholder="Select Program Anchor / Program Chair" />
		</InputGroup>
		<InputGroup isRequired label="Course Anchor">
			<MultiSelect options={courseAnchorSelect} bind:value={courseAnchorValue} placeholder="Select Course Anchor" />
		</InputGroup>
		<InputGroup isRequired label="Meeting Date">
			<Input value={masterData.meeting_date_timestamp} type="datetime-local" name="meeting_date" />
		</InputGroup>
		<InputGroup isRequired label="Meeting Name">
			<Input type="text" name="meeting_name" value={masterData.meeting_name} />
		</InputGroup>
		<InputGroup isRequired label="Attendees">
			<MultiSelect options={attendeesSelect} bind:value={attendeesValue} placeholder="Select Attendees" />
		</InputGroup>
		<InputGroup label="Meeting Link & Password">
			<Textarea
				placeholder="Meeting Link & Password"
				name="meeting_description"
				value={masterData.meeting_description}
			/>
		</InputGroup>
	</FormCard>
	<div class="flex justify-normal gap-8 mx-auto">
		<Button class="w-32" color="green" type="submit" on:click={(e) => handleSubmit(e, false)}>Save as Draft</Button>
		<Button class="w-32" color="green" type="submit" on:click={(e) => handleSubmit(e, true)}>Submit</Button>
	</div>
</form>
