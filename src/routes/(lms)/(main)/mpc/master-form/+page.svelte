<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import { Button, Input, Badge, Textarea, Label, Radio } from 'flowbite-svelte';
	import Select from '$lib/components/form/Select.svelte';
	import { X, PlusSquare, Trash2Icon} from 'lucide-svelte';
	import { formatDateTime, getAcadyearForOption } from '$lib/utils/helper/index.js';
	import MultiSelect from '$lib/components/form/MultiSelect.svelte';
	import type { Options, SelectFieldOption } from '$lib/types/form';
	import { showConfirmation } from '$lib/components/modals/Confirm.svelte';
	import { getOptions } from '$lib/utils/helper/forms/options.helper';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import type { FetchResponse } from '$lib/types/response';
	import { addToast } from '$lib/stores/toast-store';
	import { validateMasterForm } from '$lib/utils/validations/mpc.validation';
	import { onMount } from 'svelte';

	let form: HTMLFormElement;
	async function handleSubmit(isFinalSubmit: boolean) {
		const message = isFinalSubmit
			? 'Are you sure you want to submit this master form?'
			: 'Are you sure you want to save this master form as draft?';
		const confirmed = await showConfirmation(message);
		if (!confirmed) return;

		let data: any[] = [];

		document.querySelectorAll('.commonArray').forEach((elem,i) =>{
			let programObj = JSON.parse((elem.querySelector('input[name="program_lid"]') as HTMLInputElement).value);
			let sessionObj = JSON.parse((elem.querySelector('input[name="session_lid"]') as HTMLInputElement).value);
			let subjectObj = JSON.parse((elem.querySelector('input[name="subject_lid"]') as HTMLInputElement).value);
			let campusObj = JSON.parse((elem.querySelector('input[name="campus_lid"]') as HTMLInputElement).value);
			let parent = (elem.querySelector('input[name="is_parent"]') as HTMLInputElement)?.checked ?? false;
			console.log("elem : ",parent);
			let obj = {
			is_parent:parent,
			acad_year: acadYear,
			session_lid: sessionObj.value,
			program_lid: programObj.value,
			subject_lid: subjectObj.value,
			meeting_name,
			meeting_description: meeting_description,
			meeting_date: datesArray.map((date) => date.key),
			program_anchor: programAnchorValue.map((val) => Number(val)),
			course_anchor: courseAnchorValue.map((val) => Number(val)),
			attendees: attendeesValue.map((val) => Number(val)),
			is_final_submit: isFinalSubmit,
			campus_lid : Number(campusObj.value)
		}

		const validated = validateMasterForm(obj);

		if (!validated) {
			isLoading = false;
			return;
		}

		data.push(obj);
	
		});
		const atleastOneIsParent = data.some((val) => val.is_parent && val.campus_lid != '-1');

		if(!atleastOneIsParent) {
			addToast({
				color: 'red',
				heading: "Error",
				message: "Selection of campus in Parent meeting is Mandatory!",
				position: 'bottom-right',
				error: true,
			});
			return;
		}

		console.log(data);
		

	

		const { json, error } = await fetchApi<FetchResponse>(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/master-form`,
			'POST',
			data
		);
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
			isLoading = false;
			return;
		}

		addToast({
			color: 'green',
			heading: json.status,
			message: isFinalSubmit ? 'Master form Submitted Successfully' : 'Master form Saved as Draft Successfully',
			position: 'bottom-right',
			error: false
		});
		isLoading = false;
		handleReset();
		
	}

	type Date = {
		key: string;
		value: string;
	};

	function handleDateChange(e: Event) {
		const value = (e.target as HTMLDataElement).value;
		if (datesArray.some((val) => val?.value === value)) return;
		datesArray = [...datesArray, { key: value, value: formatDateTime(value) }];
	}

	async function handleRemoveDate(key: string) {
		const isConfirmed = await showConfirmation('Are you sure you want to remove this date?');
		if (isConfirmed) {
			datesArray = datesArray.filter((date) => date.key !== key);
			if (datesArray.length === 0) form.meeting_date.value = '';
		}
	}
	export let data;

	$:console.log("CAMPUS LIST : ",data.campusList);
	

	let programSelect: SelectFieldOption[] = [];
	let subjectSelect: SelectFieldOption[] = [];
	let acadSessionSelect: SelectFieldOption[] = [];
	let programAnchorSelect: Options[] = [];
	let programAnchorValue: (string | number)[] = [];
	let courseAnchorSelect: Options[] = [];
	let courseAnchorValue: (string | number)[] = [];
	let attendeesSelect: Options[] = [];
	let attendeesValue: (string | number)[] = [];
	let datesArray: Date[] = [];
	let meeting_name = '';
	let meeting_description = '';
	let meeting_date = '';
	let isLoading = false;


	let acadYear: string | undefined, program: string | undefined, subject: string | undefined, acadSession: string | undefined, campusLid: string | undefined;

	async function handleAcadYear() {
		
		if(!acadYear || acadYear == '-1') {
			addToast({
				color: 'red',
				heading: "Error",
				message: "Select Acad Year",
				position: 'bottom-right',
				error: true,
			});
			return
		}

		programSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/program-by-username-and-year?acadYear=${acadYear}&campusLid=${campusLid}`
		);

	}

	async function handleProgram() {
		acadSessionSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/acad-session-by-program?programLid=${program}&acadYear=${acadYear}`
		);

		const programLabel = programSelect.find(item => item.value === program);
		if (programLabel) {
			console.log("programLabel.label.toString().length : ",programLabel.label.toString().length);
			
			if(programLabel.label.toString().length <= 20){
				meeting_name +=programLabel.label
			} else if (!meeting_name.includes((programLabel.label).toString().split('-')[1])) {
				meeting_name +=  (programLabel.label).toString().split('-')[1]
			}
		}
	}


	let programAnchorSelectTemp:Options[] = [];
	let courseAnchorSelectTemp:Options[] = [];
	let attendeesSelectTemp:Options[] = [];
	async function handleSubject() {

		Promise.all([
			getOptions(
				`${PUBLIC_FETCH_BASE_URL}/mpc/api/program-anchor?acadYear=${acadYear}&programLid=${program}&subjectLid=${subject}&acadSessionLid=${acadSession}`
			),
			getOptions(
				`${PUBLIC_FETCH_BASE_URL}/mpc/api/course-anchor?acadYear=${acadYear}&programLid=${program}&subjectLid=${subject}&acadSessionLid=${acadSession}`
			),
			getOptions(
				`${PUBLIC_FETCH_BASE_URL}/mpc/api/attendees?acadYear=${acadYear}&programLid=${program}&subjectLid=${subject}&acadSessionLid=${acadSession}`
			)
		]).then(([programAnchor, courseAnchor, attendees]) => {

			programAnchor.forEach(option => programAnchorSelectTemp.push(option));
			courseAnchor.forEach(option => courseAnchorSelectTemp.push(option));
			attendees.forEach(option => attendeesSelectTemp.push(option));

			// programAnchorSelect = programAnchorSelectTemp.filter(value => !programAnchorSelect.includes(value));
			// courseAnchorSelect = courseAnchorSelectTemp.filter(value => !courseAnchorSelect.includes(value));
			// attendeesSelect = attendeesSelectTemp.filter(value => !attendeesSelect.includes(value));
			
			programAnchorSelect = [...programAnchorSelect, ...programAnchor];
			courseAnchorSelect = [...courseAnchorSelect, ...courseAnchor];
			attendeesSelect = [...attendeesSelect, ...attendees];

			const subjectLabel = subjectSelect.find(item => item.value === subject);
			if (subjectLabel) {
				if (!meeting_name.includes((subjectLabel.label).toString())) {
					meeting_name +=  " - " + subjectLabel.label;
				}
			}

		});
	}

	$:console.log("BBBBBBBBBB : ",programAnchorSelect);
	

	async function handleAcadSession() {
		subjectSelect = await getOptions(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/subject-by-program?programLid=${program}&acadYear=${acadYear}&acadSessionLid=${acadSession}`
		);

		const sessionLabel = acadSessionSelect.find(item => item.value === acadSession);
		if (sessionLabel) {
			if (!meeting_name.includes((sessionLabel.label).toString())) {
				meeting_name +=  " - " + sessionLabel.label;
			}
		}

	}

	function handleReset() {
		form?.reset()
		acadYear = undefined;
		program = undefined;
		subject = undefined;
		acadSession = undefined;
		programAnchorSelect = [];
		courseAnchorSelect = [];
		meeting_name = '';
		meeting_description = '';
		attendeesSelect = [];
		meeting_date = '';
		datesArray = [];
	}

	type addRow = {}
	let addArray: addRow[] = [{}];
	function addButton() {
    	addArray = [...addArray, {}];
  	}

	function removeRow(index: any) {
		addArray = addArray.filter((_, i) => i !== index);
	}

	onMount(() => {
		const checkbox = document.querySelector<HTMLInputElement>('#isParent');
		if (checkbox !== null) {
			checkbox.checked = true;
		} else {
			console.error("Checkbox '#isParent' not found.");
		}
	});



</script>

<form bind:this={form} class="flex flex-col gap-4">
	<FormCard class="form">
		<svelte:fragment slot="heading">Create Meeting</svelte:fragment>
		<InputGroup isRequired label="Acad Year">
			<Select
				options={getAcadyearForOption()}
				on:change={handleAcadYear}
				bind:value={acadYear}
				name="acad_year"
				placeholder="Select Acad Year"
			/>
		</InputGroup>
		<InputGroup isRequired label="Meeting Date">
			<Input
				type="datetime-local"
				on:change={handleDateChange}
				name="meeting_date"
				bind:value={meeting_date}
			/>
		</InputGroup>
		{#each addArray as row, index}
		<div class="border border-blue-600 border-dashed py-3 col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-1 sm:gap-3 md:gap-4 commonArray"> 
			<div class="col-span-1 row-span-2 flex justify-evenly items-center">
				{#if index > 0}
					<Button size="xs" on:click={() => removeRow(index)}  title="Delete Row" class="rounded-full px-5" color="red">Delete <Trash2Icon class="ml-2"/> </Button>
				{:else}
					<Button size="xs" on:click={addButton} title="Add Row" class="rounded-full px-5"> Add <PlusSquare class="ml-2"/></Button>
					<Radio name="is_parent" id="isParent">
						is parent
					</Radio>
				{/if}
			</div>
			<InputGroup isRequired label="Campus" class="col-span-2">
				<Select
					name="campus_lid"
					options={data.campusList}
					placeholder="Select Campus"
					on:change={handleAcadYear}
					bind:value={campusLid}
				/>
			</InputGroup>
			<InputGroup isRequired label="Program" class="col-span-2">
				<Select
					name="program_lid"
					options={programSelect}
					placeholder="Select Program"
					on:change={handleProgram}
					bind:value={program}
				/>
			</InputGroup>
			<InputGroup isRequired label="Acad Session" class="col-span-2">
				<Select
					name="session_lid"
					options={acadSessionSelect}
					placeholder="Select Acad Session"
					on:change={handleAcadSession}
					bind:value={acadSession}
				/>
			</InputGroup>
			<InputGroup isRequired label="Course" class="col-span-2">
				<Select
					name="subject_lid"
					options={subjectSelect}
					placeholder="Select Course"
					on:change={handleSubject}
					bind:value={subject}
				/>
			</InputGroup>
		</div>
		{/each}


		<!-- <div class="border border-blue-600 border-dashed py-3 col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-3 md:gap-4 commonArray">
			<div class="col-span-1 flex justify-evenly items-center" data-val={index}>
				<Button size="xs" on:click={() => removeRow(index)}  title="Delete Row" class="rounded-full px-5" color="red">Delete <Trash2Icon class="ml-2"/> </Button>
				<Radio name="is_parent" checked={false} >
					is parent
				</Radio>
			</div>
			<InputGroup isRequired label="Program" class="col-span-1">
				<Select
					name="program_lid"
					options={programSelect}
					placeholder="Select Program"
					on:change={handleProgram}
					bind:value={program}
				/>
			</InputGroup>
			<InputGroup isRequired label="Acad Session" class="col-span-1">
				<Select
					name="session_lid"
					options={acadSessionSelect}
					placeholder="Select Acad Session"
					on:change={handleAcadSession}
					bind:value={acadSession}
				/>
			</InputGroup>
			<InputGroup isRequired label="Course" class="col-span-1">
				<Select
					name="subject_lid"
					options={subjectSelect}
					placeholder="Select Subject"
					on:change={handleSubject}
					bind:value={subject}
				/>
			</InputGroup>
		</div> -->

		<InputGroup isRequired label="Program Anchor / Program Chair">
			<MultiSelect
				bind:value={programAnchorValue}
				bind:options={programAnchorSelect}
				placeholder="Select Program Anchor / Program Chair"
			/>
		</InputGroup>
		<InputGroup isRequired label="Course Anchor">
			<MultiSelect
				bind:value={courseAnchorValue}
				bind:options={courseAnchorSelect}
				placeholder="Select Course Anchor"
			/>
		</InputGroup>
		<InputGroup isRequired label="Meeting Name">
			<Input type="text" name="meeting_name" bind:value={meeting_name} />
		</InputGroup>
		<InputGroup label="Attendees">
			<MultiSelect
				bind:value={attendeesValue}
				bind:options={attendeesSelect}
				placeholder="Select Attendees"
			/>
		</InputGroup>
		<InputGroup label="Meeting Link & Password">
			<Textarea
				placeholder="Meeting Link & Password"
				name="meeting_description"
				bind:value={meeting_description}
			/>
		</InputGroup>
		{#if datesArray.length > 0}
			<div class="date-show col-span-full">
				<h3 class="font-semibold">Dates Preview:</h3>
				{#each datesArray as date}
					<Badge rounded class="date-badge md:py-3 mr-2 my-1">
						{date.value}
						<button on:click={() => handleRemoveDate(date.key)}>
							<X class="w-3 h-3 cursor-pointer ml-2 text-rose-700" />
						</button>
					</Badge>
				{/each}
			</div>
		{/if}
	</FormCard>
	<div class="flex justify-normal gap-8 mx-auto">
		<!-- <Button class="w-32" color="red" type="reset" on:click={handleReset}>Reset</Button> -->
		<Button on:click={() => handleSubmit(false)} disabled={isLoading} class="w-32 lg:w-64" color="blue" type="submit"
			>Save As Draft</Button
		>
		<Button on:click={() => handleSubmit(true)} disabled={isLoading} class="w-32 lg:w-64" color="green" type="submit"
			>Submit</Button
		>
	</div>
</form>
