<script>
	import Tree from './../components/Tree.svelte';
	import { search } from './../libs/ecommerce.js';
    import { onDestroy, onMount } from "svelte";
    import { serverJWT } from "../libs/store";

    export let id;
    export let selected = async (data) => {}
    
    let visible = false;

    let nodes = new vis.DataSet([]);
    let edges = new vis.DataSet([]);

    async function loadData(value) {

        let identities = await search($serverJWT)

        nodes = new vis.DataSet(identities.map(identity => {
            return {
                id: identity.identityId,
                label: identity.username
            }
        }))

        edges = new vis.DataSet(identities.filter(x => x.verifiableCredentials && x.verifiableCredentials.length > 0).map(identity => {
            let from = identity.verifiableCredentials[0].credentialSubject.initiatorId 
            let to = identity.verifiableCredentials[0].credentialSubject.id 
            return {
                id: from + ";" + to,
                from, 
                to
            }
        }))

        visible = true

    }

    let unsubscribe = () => {}

    onMount(async () => {
        console.log("MOunt")
        visible = false;
        if ($serverJWT) {
            loadData($serverJWT)
        }
        else {
            unsubscribe = serverJWT.subscribe(loadData)
        }
    })

    onDestroy(unsubscribe)

</script>

{#if visible}
<Tree {id} {nodes} {edges} {selected} />
{/if}