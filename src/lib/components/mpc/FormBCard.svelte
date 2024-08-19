<script lang="ts">
	import type { FormAForFormB } from '$lib/types/mpc';

	import { Accordion, AccordionItem, Label, Textarea } from 'flowbite-svelte';
	import FormA from './FormA.svelte';
	import { formA } from '$lib/utils/constants/testing';
	export let meeting: FormAForFormB;
</script>

<Accordion
	class="w-full base mx-auto mb-4 text-sm col-span-full"
	classActive="bg-white dark:bg-base-dark-900"
>
	<AccordionItem>
		<span slot="header">
			<div class="flex justify-evenly gap-2 md:gap-6">
				<div class="flex gap-2 md:gap-5 flex-wrap">
					<div class="flex !text-sm font-semibold md:text-base gap-2">
						<span class="font-bold text-black dark:text-slate-200"> Meeting Name:</span>
						<p class="capitalize">{meeting.meeting_name}</p>
					</div>
					<div class="flex !text-sm font-semibold md:text-base gap-2">
						<span class="font-bold text-black dark:text-slate-200"> Acad year:</span>
						<p>{meeting.acad_year}</p>
					</div>
					<div class="flex !text-sm font-semibold md:text-base gap-2">
						<span class="font-bold text-black dark:text-slate-200"> Program Name:</span>
						<p>{meeting.program_name}</p>
					</div>
					<div class="flex !text-sm font-semibold md:text-base gap-2">
						<span class="font-bold text-black dark:text-slate-200"> Subject Name:</span>
						<p>{meeting.subject_name}</p>
					</div>
					<div class="flex !text-sm font-semibold md:text-base gap-2">
						<span class="font-bold text-black dark:text-slate-200"> Acad Session:</span>
						<p>{meeting.acad_session}</p>
					</div>
				</div>
			</div>
		</span>
		{meeting.summary}
		<FormA datas={formA} readOnly={true} />
		<Label class="mt-5">
			Remarks
			<Textarea rows={4} placeholder="Enter Your text" />
		</Label>
	</AccordionItem>
</Accordion>
