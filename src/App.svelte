<script>
	import ServerAdmin from './pages/ServerAdmin.svelte';
	import Entity from './pages/Entity.svelte';
	import { apiKey } from './libs/store.js';
	import { onMount } from "svelte";
	export let configApiKey;

	let role;

	onMount(async () => {
        $apiKey = configApiKey;
	})

</script>

{#if !role}
<div class="dropdown">
	<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	  {role ? role : 'Choose Your Role'}
	</button>
	<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
		<a class="dropdown-item" on:click|preventDefault={() => { role = null }} href="!#">- None -</a>
		<a class="dropdown-item" on:click|preventDefault={() => { role = "Server Admin" }} href="!#">Server Admin</a>
	  	<a class="dropdown-item" on:click|preventDefault={() => { role = "Entity" }} href="!#">Entity</a>
	</div>
</div>
{/if}

{#if role === "Server Admin"}
	<ServerAdmin bind:role={role}></ServerAdmin>
{/if}

{#if role === "Entity"}
	<Entity></Entity>
{/if}

