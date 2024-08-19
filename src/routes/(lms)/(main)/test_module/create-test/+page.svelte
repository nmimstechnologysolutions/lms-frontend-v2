<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import { Button, Input, Badge, Textarea } from 'flowbite-svelte';
	import Select from '$lib/components/form/Select.svelte';
	import { X } from 'lucide-svelte';
	import { formatDateTime, getAcadyearForOption } from '$lib/utils/helper/index.js';
	import MultiSelect from '$lib/components/form/MultiSelect.svelte';
    import { PUBLIC_FETCH_BASE_URL} from '$env/static/public';
	import type { Options, SelectFieldOption } from '$lib/types/form';
	import { showConfirmation } from '$lib/components/modals/Confirm.svelte';
	import { getOptions } from '$lib/utils/helper/forms/options.helper';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import type { FetchResponse } from '$lib/types/response';
	import { addToast } from '$lib/stores/toast-store';

    let isLoading = false;
	let form: HTMLFormElement;
    let test_name: string;
    let courseSelect: SelectFieldOption[] = [];
    async function handleCourceChange() {
		courseSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/api/get-course-list`
		);
	}
    let course_lid : string;
    let start_date : string;
    let end_date : string;
    let test_duration : string;
    let testTypeSelect: SelectFieldOption[] = [];
    async function handletestTypeChange() {
		testTypeSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/api/get-test-type`
		);
    }
    let testTypeLid : string;
    let totalMarks : string;
    let passingMarks : string;
    let test_description : string;

    async function handleSubmit() {

    }
</script>

<form bind:this={form} class="flex flex-col gap-4">
	<FormCard class="form">
		<svelte:fragment slot="heading">Create Test</svelte:fragment>
        <InputGroup isRequired label="Test Name">
			<Input type="text" name="test_name" bind:value={test_name} />
		</InputGroup>
        <InputGroup isRequired label="Course Name">
			<Select
				options={courseSelect}
				on:change={handleCourceChange}
				bind:value={course_lid}
				name="course_lid"
				placeholder="Select Course Name"
			/>
		</InputGroup>
        <InputGroup isRequired label="Start Date">
			<Input type="datetime-local" name="start_date" bind:value={start_date} />
		</InputGroup>
        <InputGroup isRequired label="End Date">
			<Input type="datetime-local" name="end_date" bind:value={end_date} />
		</InputGroup>
        <InputGroup isRequired label="Test Duration">
			<Input type="number" name="test_duration" bind:value={test_duration} />
		</InputGroup>
        <InputGroup isRequired label="Test Type">
			<Select
				options={testTypeSelect}
				on:change={handletestTypeChange}
				bind:value={testTypeLid}
				name="course_id"
				placeholder="Select Course Name"
			/>
        </InputGroup>
        <InputGroup isRequired label="Test Total Marks">
			<Input type="number" name="total_marks" bind:value={totalMarks} />
		</InputGroup>
        <InputGroup isRequired label="Test Passing Marks">
			<Input type="number" name="passing_marks" bind:value={passingMarks} />
		</InputGroup>
        <InputGroup label="Test Description">
			<Textarea
				placeholder="Test Description"
				name="test_description"
				bind:value={test_description}
			/>
		</InputGroup>
	</FormCard>
    <div class="flex justify-normal gap-8 mx-auto">
		<Button on:click={() => handleSubmit()} disabled={isLoading} class="w-32 lg:w-64" color="green" type="submit"
			>Submit</Button
		>
	</div>
</form>
