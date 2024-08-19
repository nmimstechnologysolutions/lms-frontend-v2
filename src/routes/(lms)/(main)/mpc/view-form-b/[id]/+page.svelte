<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import FormB from '$lib/components/mpc/FormB.svelte';
	import NewFormB from '$lib/components/mpc/newFormB.svelte';
	import { Input } from 'flowbite-svelte';
	
	export let data;

	$: console.log(data);
	$: formDetails = data.formDetails
	$: newFormData = data.newTableData
	$: console.log(newFormData);

</script>

<div class="mb-6">
	<FormCard class="form">
		<svelte:fragment slot="heading">View Form B</svelte:fragment>
		<InputGroup label="Acad Year">
			<Input
				name="acadYear"
				value={formDetails.acad_year}
				disabled
			/>
		</InputGroup>
		<InputGroup label="Programs">
			<Input
				name="program_name"
				value={formDetails.program_name}
				disabled
			/>
		</InputGroup>
		<InputGroup label="Acad Session">
			<Input
				name="acad_session"
				value={formDetails.acad_session}
				disabled
			/>
		</InputGroup>
	</FormCard>
</div>
	
<!-- <FormB 
	datas={data.formData} 
	formBObj={{acadYear: formDetails.acad_year, acadSession: formDetails.session_lid, program: formDetails.program_lid}} 
	readOnly
	isRemarksDisabled={true} 
/> -->

{#if newFormData}
	<NewFormB newTableData={newFormData} acad_year={formDetails.acad_year} program_lid={formDetails.program_lid} session_lid={formDetails.session_lid} readOnly={true}/>
{/if}
