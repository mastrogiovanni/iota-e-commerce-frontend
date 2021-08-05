<script>
    import { onMount } from "svelte";

    import IdentityCard from "../components/IdentityCard.svelte";
    import { getIdInfo } from '../libs/ecommerce.js'

    export let identity = undefined;
    export let did = undefined;

    onMount(async () => {
        if (did) {
            identity = await getIdInfo(id)
        }
    });
</script>

{#if identity}
<IdentityCard
    username={identity?.username}
    role={identity?.claim?.type}
    claim={identity?.claim}
    certified={identity?.verifiableCredentials?.length > 0 ?? false}
/>
{/if}