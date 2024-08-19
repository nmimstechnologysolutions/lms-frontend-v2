<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import { Badge, Input } from 'flowbite-svelte';
	import MultiSelect from '$lib/components/form/MultiSelect.svelte';
	import FormA from '$lib/components/mpc/FormA.svelte';
	
	export let data;
	$: masterData = data.masterData;

	$: countData = data.countJson

	$: console.log(countData);
	
</script>

<div class="mb-6">
	<FormCard class="form">
		<svelte:fragment slot="heading">View Form A</svelte:fragment>
		<InputGroup label="Acad Year">
			<Input type="text" disabled  value={masterData.acad_year} />
		</InputGroup>
		<InputGroup label="Program Name">
			<Input type="text" disabled  value={masterData.program_name} />
		</InputGroup>
		<InputGroup label="Subject Name">
			<Input type="text" disabled  value={masterData.subject_name} />
		</InputGroup>
		<InputGroup label="Acad Session">
			<Input type="text" disabled  value={masterData.acad_session} />
		</InputGroup>
		<InputGroup label="Meeting Date">
			<Input type="text" disabled  value={masterData.meeting_date} />
		</InputGroup>
		<InputGroup label="Course Anchor">
			<MultiSelect
				readonly
				options={data?.countJson?.[0].ca_array}
				placeholder="Course Anchor"
			/>
		</InputGroup>
		<InputGroup>
			<Badge class="w-full mb-3 h-auto min-h-8 font-extrabold flex flex-col gap-y-2 py-3" color="yellow">
				Meeting Count : {data?.countJson?.[0].count} <div> Meeting Dates : {data?.countJson?.[0].date_array}</div>
			</Badge>
		</InputGroup>
		<InputGroup label="Attendees">
			<MultiSelect
				readonly
				options={data.attendeesOptions}
				placeholder="Select Attendees"
			/>
		</InputGroup>
		<InputGroup label="Absentees">
			<MultiSelect
				readonly
				options={data.absenteesOptions}
				placeholder="Select Absentees"
			/>
		</InputGroup>
	</FormCard>
</div>

<FormA datas={data. formAGrouped} readOnly />
