<script>
    import { onMount } from "svelte";

    import IdentityCard from "../components/IdentityCard.svelte";
    import IdentityForm from "../components/IdentityForm.svelte";
    import { getIdInfo } from '../libs/ecommerce.js'

    let identities = [
        "did:iota:D9LFDkg5A8jAfNHTrAqVxRum4u33n8PMxe4qVojCsM3v",
        "did:iota:3BJ9uMacnGhw9TdA5GfrKFtnJqpLhPypUGUkPWXfBChY",
    ];

    let credentials = [];

    onMount(async () => {
        for (let id of identities) {
            let info = await getIdInfo(id)
            if (info) {
                credentials.push(info);
                credentials = credentials;
            }
        }
        console.log(credentials);
    });
</script>

<div class="card-deck">
    {#each credentials as credential}
        <IdentityCard
            username={credential?.username}
            role={credential?.role}
            claim={credential?.claim}
            certified={credential?.verifiableCredentials?.length > 0 ?? false}
        />
    {/each}
</div>
