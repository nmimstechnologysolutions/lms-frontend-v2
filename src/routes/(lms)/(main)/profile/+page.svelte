<script lang="ts">
	import FormCard from '$lib/components/form/FormCard.svelte';
	import InputGroup from '$lib/components/form/InputGroup.svelte';
	import ProfileUpdate from '$lib/components/modals/ProfileUpdate.svelte';
	import { Button, Input } from 'flowbite-svelte';
	
	export let data;
    let formStage: "EMAIL" | "MOBILE" | "PASSWORD";

    $: userDetails = data.json.user_detail;
    let isMOdalOpen = false;
</script>

<div class="mb-2 max-w-6xl mx-auto">
	<FormCard class="form">
		<svelte:fragment slot="heading">Profile</svelte:fragment>
		<InputGroup isRequired label="Username">
            <Input type="text" value={userDetails.username} disabled />
		</InputGroup>
		<InputGroup isRequired label="First Name">
            <Input type="text" value={userDetails.first_name} disabled />
		</InputGroup>
		<InputGroup isRequired label="Last Name">
            <Input type="text" value={userDetails.last_name} disabled />
		</InputGroup>
		<InputGroup isRequired label="Email" >
            <Input type="text" value={userDetails.email} disabled />
            <!-- <div class="flex gap-x-2">
                <Button type="submit" on:click={() => {isMOdalOpen = true; formStage = "EMAIL"}}>UPDATE</Button>
            </div> -->
        </InputGroup>
		<InputGroup isRequired label="Mobile No">
            <Input type="text" value={userDetails.mobile} disabled />
            <!-- <div class="flex gap-x-2">
                <Button type="submit" on:click={() => {isMOdalOpen = true; formStage = "MOBILE"}}>UPDATE</Button>
            </div> -->
        </InputGroup>
	</FormCard>
    <hr>
    <FormCard class="form mt-6">
		<svelte:fragment slot="heading">
            <h5 class="text-2xl">CHANGE PASSWORD</h5>
        </svelte:fragment>
        <InputGroup>
            <Button type="submit"  on:click={() => {isMOdalOpen = true; formStage = "PASSWORD"}}>Change Password</Button>
        </InputGroup>   
    </FormCard>

</div>
<ProfileUpdate bind:isOpen={isMOdalOpen} bind:formStage/>


