<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import Select from '$lib/components/form/Select.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import { PUBLIC_FETCH_BASE_URL } from '$env/static/public';
	import type { Options } from '$lib/types/form';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,

		Checkbox

	} from 'flowbite-svelte';
	import { fetchApi } from '$lib/utils/helper/fetchApi';
	import type { FetchResponse } from '$lib/types/response';
	import { addToast } from '$lib/stores/toast-store';
	import { getAcadyearForOption } from '$lib/utils/helper';
	import { boolean } from 'zod';

	export let data;

	let usernameSelect: Options[] = [];
	let programSelect: Options[] = [];
	let campusSelect: Options[] = [];
	let acadSessionSelect: Options[] = [];
	let subjectSelect: Options[] = [];
	let course_anchor: boolean = true;
	let program_anchor: boolean = true;


	$: {
		usernameSelect = data.options[0];
		programSelect = data.options[1];
		campusSelect = data.options[2];
		acadSessionSelect = data.options[3];
		subjectSelect = data.options[4];
	}

	let program_lid: string,
		subject_lid: string,
		session_lid: string,
		user_lid: string,
		campus_lid: string,
		acad_year: string;

	// List to store selected combinations
	let selectedData: {
		user_lid: string;
		program_lid: string;
		campus_lid: string;
		session_lid: string;
		subject_lid: string;
		acad_year: string;
		course_anchor: boolean;
		program_anchor: boolean;
	}[] = [];

	async function addMapping() {
		if (user_lid && program_lid && campus_lid && subject_lid && session_lid && acad_year) {
			const exists = selectedData.some(
				(item) =>
					item.user_lid === user_lid &&
					item.program_lid === program_lid &&
					item.campus_lid === campus_lid &&
					item.subject_lid === subject_lid &&
					item.session_lid === session_lid &&
					item.acad_year === acad_year
			);

			if (exists) {
				addToast({
					color: 'red',
					heading: 'ERROR',
					message: 'Faculty Detail Already Present!',
					position: 'bottom-right',
					error: true,
					errorId: ''
				});
				return;
			}

			selectedData = [
				...selectedData,
				{ user_lid, program_lid, campus_lid, session_lid, subject_lid, acad_year, program_anchor, course_anchor}
			];

			console.log('before insert',selectedData);
			
		} else {
			addToast({
				color: 'red',
				heading: 'ERROR',
				message: 'All Fields are required!',
				position: 'bottom-right',
				error: true,
				errorId: ''
			});
		}
	}

	async function addMappingButton() {
		const data = selectedData;
		const { json, error } = await fetchApi<FetchResponse>(
			`${PUBLIC_FETCH_BASE_URL}/mpc/api/add-anchor-mannual`,
			'POST',
			data
		);
		console.log({
			json,
			error
		});
		if (error) {
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
			heading: 'SUCCESS',
			message: json.message,
			position: 'bottom-right',
			error: false
		});

		selectedData = [];
	}

	function removeCombination(index: number) {
		selectedData = selectedData.filter((_, i) => i !== index);
	}

	// Function to get the label from the value
	function getLabel(options: Options[], value: string | number): string | number {
		const option = options.find((opt) => opt.value === value);
		return option ? option.label : value;
	}
</script>

<div class="mb-2">
	<FormCard class="form">
		<svelte:fragment slot="heading">Manual Faculty Mapping</svelte:fragment>
		<InputGroup isRequired label="Username">
			<Select
				name="username"
				options={usernameSelect}
				placeholder="Select Faculty"
				bind:value={user_lid}
			/>
		</InputGroup>
		<InputGroup isRequired label="Program">
			<Select
				name="program_name"
				options={programSelect}
				placeholder="Select Program"
				bind:value={program_lid}
			/>
		</InputGroup>
		<InputGroup isRequired label="Campus">
			<Select
				name="campus_name"
				options={campusSelect}
				placeholder="Select Campus"
				bind:value={campus_lid}
			/>
		</InputGroup>
		<InputGroup isRequired label="Acad Session">
			<Select
				name="acad_session"
				options={acadSessionSelect}
				placeholder="Select Acad Session"
				bind:value={session_lid}
			/>
		</InputGroup>
		<InputGroup isRequired label="Subjects">
			<Select
				name="subject_name"
				options={subjectSelect}
				placeholder="Select Subject"
				bind:value={subject_lid}
			/>
		</InputGroup>
		<InputGroup isRequired label="Acad Year">
			<Select
				name="acad_year"
				options={getAcadyearForOption()}
				placeholder="Select Academic Year"
				bind:value={acad_year}
			/>
		</InputGroup>
		<InputGroup>
			<Checkbox name="chechbox" bind:checked={program_anchor}>Program Anchor</Checkbox>
		</InputGroup>
		<InputGroup>
			<Checkbox name="chechbox" bind:checked={course_anchor}>Course Anchor</Checkbox>
		</InputGroup>
		<div class="flex justify-center mt-4">
			<Button on:click={addMapping} class="w-32 lg:w-64" color="green" type="submit">Add</Button>
		</div>
	</FormCard>
</div>

{#if selectedData.length > 0}
	<div class="mt-4">
		<h2 class="text-lg font-bold mb-4">Selected Combinations:</h2>
		<Table id="assign-role-table" hoverable={true}>
			<TableHead theadClass="t-head">
				<TableHeadCell>Username</TableHeadCell>
				<TableHeadCell>Program</TableHeadCell>
				<TableHeadCell>Campus</TableHeadCell>
				<TableHeadCell>Acad Session</TableHeadCell>
				<TableHeadCell>Subject</TableHeadCell>
				<TableHeadCell>AcadYear</TableHeadCell>
				<TableHeadCell>Anchor</TableHeadCell>
				<TableHeadCell>Action</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y t-body">
				{#each selectedData as combination, index}
					<TableBodyRow>
						<TableBodyCell class="border px-4 py-2"
							>{getLabel(usernameSelect, combination.user_lid)}</TableBodyCell
						>
						<TableBodyCell class="border px-4 py-2"
							>{getLabel(programSelect, combination.program_lid)}</TableBodyCell
						>
						<TableBodyCell class="border px-4 py-2"
							>{getLabel(campusSelect, combination.campus_lid)}</TableBodyCell
						>
						<TableBodyCell class="border px-4 py-2"
							>{getLabel(acadSessionSelect, combination.session_lid)}</TableBodyCell
						>
						<TableBodyCell class="border px-4 py-2"
							>{getLabel(subjectSelect, combination.subject_lid)}</TableBodyCell
						>
						<TableBodyCell class="border px-4 py-2">{combination.acad_year}</TableBodyCell>
						<TableBodyCell class="border px-4 py-2">
							<ul>
								<li>{combination.program_anchor ? 'Program Anchor' : ''}</li>
								<li>{combination.course_anchor ? 'Course Anchor' : ''}</li>
							</ul>
						</TableBodyCell>
						<TableBodyCell class="border px-4 py-2">
							<button
								on:click={() => removeCombination(index)}
								class="text-red-500 hover:text-red-700">Remove</button
							>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<div class="flex justify-center mt-4">
			<Button on:click={addMappingButton} class="w-32 lg:w-64" color="green" type="submit"
				>Add Faculty Mapping</Button
			>
		</div>
	</div>
{/if}
