<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import { Input, Textarea } from 'flowbite-svelte';
	import Select from '$lib/components/form/Select.svelte';
	import MultiSelect from '$lib/components/form/MultiSelect.svelte';

	export let data;

	$: masterData = data.masterData;
</script>

<form class="flex flex-col gap-4 mx-auto">
	<FormCard class="form">
		<svelte:fragment slot="heading">View Meeting</svelte:fragment>
		<InputGroup label="Acad Year">
			<Input
				value={masterData.acad_year}
				disabled
				name="acad_year"
				placeholder="Select Acad Year"
			/>
		</InputGroup>
		<InputGroup label="Program">
			<Input
				value={`${masterData.program_name} (${masterData.program_code}) - ${masterData.program_id}`}
				disabled
				name="program"
				placeholder="Select Program"
			/>
		</InputGroup>
		<InputGroup label="Course">
			<Input
				value={`${masterData.subject_name} (${masterData.subject_abbr}) - ${masterData.subject_id}`}
				disabled
				name="course"
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
		<InputGroup label="Program Anchor">
			<MultiSelect options={data.programAnchorOptions} readonly placeholder="Select Program Anchor" />
		</InputGroup>
		<InputGroup label="Course Anchor">
			<MultiSelect options={data.courseAnchorOptions} readonly placeholder="Select Course Anchor" />
		</InputGroup>
		<InputGroup label="Meeting Date">
			<Input value={masterData.meeting_date} disabled type="text" name="meeting_date" />
		</InputGroup>
		<InputGroup label="Meeting Name">
			<Input value={masterData.meeting_name} disabled name="meeting_name" />
		</InputGroup>
		<InputGroup label="Attendees">
			<MultiSelect options={data.attendeesOptions} readonly placeholder="Select Attendees" />
		</InputGroup>
		<InputGroup label="Meeting Link & Password">
			<Textarea value={masterData.meeting_description ?? 'N.A'} disabled type="text" name="meeting_description" />
		</InputGroup>
	</FormCard>
</form>
