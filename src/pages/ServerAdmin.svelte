<script>
	import ClaimEditor from './../components/ClaimEditor.svelte';
    import JSONTree from 'svelte-json-tree';
	import IdentityForm from './../components/IdentityForm.svelte';
	import ServerMenu from './../components/ServerMenu.svelte';
	import IdentityTree from '../controllers/IdentityTree.svelte';
	import { createCredential, createIdentity, getIdInfo, search } from './../libs/ecommerce.js';
	import { decrypt } from '../libs/utility.js';
    import { fetchAuth } from '../libs/ecommerce.js'
    import { onMount } from "svelte";
    import { serverJWT } from '../libs/store.js';
    import IdentityCardController from '../controllers/IdentityCardController.svelte';
	import { fade } from 'svelte/transition';

    export let role;

    let serverKey;
    let serverIdentity;
    let logged;

    let treeVisible = true;

    let page;

    function refreshTree() {
        treeVisible = false;
        setTimeout(() => {
            treeVisible = true
        })
    }

    onMount(async () => {
        if (
            sessionStorage.getItem("iota.e-commerce.server.key") &&
            sessionStorage.getItem("iota.e-commerce.server.identity") &&
            sessionStorage.getItem("iota.e-commerce.server.logged")
        ) {
            serverKey = sessionStorage.getItem("iota.e-commerce.server.key")
            serverIdentity = sessionStorage.getItem("iota.e-commerce.server.identity")
            logged = JSON.parse(sessionStorage.getItem("iota.e-commerce.server.logged"))
        }
        if (!$serverJWT) {
            logout();
        }
        serverIdentity = JSON.stringify({"_id":"did:iota:755LFLUuNh7YvPmiuA3tpvw9DBNPnVN9PFR54ngDvmx6","doc":{"id":"did:iota:755LFLUuNh7YvPmiuA3tpvw9DBNPnVN9PFR54ngDvmx6","verificationMethod":[{"id":"did:iota:755LFLUuNh7YvPmiuA3tpvw9DBNPnVN9PFR54ngDvmx6#key-collection-0","controller":"did:iota:755LFLUuNh7YvPmiuA3tpvw9DBNPnVN9PFR54ngDvmx6","type":"MerkleKeyCollection2021","publicKeyBase58":"118qhYm44Zx6BCmuf9eAoaL2NWJ9qCD4nCZU9cfNJQqrUA"}],"authentication":[{"id":"did:iota:755LFLUuNh7YvPmiuA3tpvw9DBNPnVN9PFR54ngDvmx6#key","controller":"did:iota:755LFLUuNh7YvPmiuA3tpvw9DBNPnVN9PFR54ngDvmx6","type":"Ed25519VerificationKey2018","publicKeyBase58":"2ZkjZWapHh3V53H2XWG8H46bWWRkzZ4bvcsPF8zQWKoQ"}],"created":"2021-07-29T19:08:16Z","updated":"2021-07-29T19:08:16Z","previousMessageId":"20903755a546150da27cd41c3b5929f95ddb97f259effe49e6cdf8c855e1bd96","proof":{"type":"JcsEd25519Signature2020","verificationMethod":"#key","signatureValue":"83qwGT69NfnLgRQnYtLzgrAd8qNgwFmFCbYq8ZMuh4jwUWgAKZ3KfJpXkv9sisebirRqFdmjKYYPLYXzZca3DaS"}},"key":{"type":"ed25519","public":"2ZkjZWapHh3V53H2XWG8H46bWWRkzZ4bvcsPF8zQWKoQ","secret":"c53b57de10d32d6d188aada151210de5,54edaae4bb6233ce6e0c884ba5899536381d7836a1ad0c06370d1db1810c65d50043677351cc08f562e43722","encoding":"base58"},"txHash":"84728d4359170338fc56151980e5ebe981d4982e16e7d065b4ac0238338d5ef5","created":{"$date":"2021-07-29T19:08:18.776Z"}})
        serverKey = "PpKFhPKJY2efTsN9VkB7WNtYUhX9Utaa"
    })

    async function getServerIdentity() {
        let identity = JSON.parse(serverIdentity)
        let secret = identity?.key?.secret;
        let decrypted = await decrypt(secret, serverKey)
        identity.key.secret = decrypted
        return identity;
    }

    async function login() {
        try {
            let identity = await getServerIdentity()
            let jwt = await fetchAuth(identity);
            if (jwt) {
                sessionStorage.setItem("iota.e-commerce.server.jwt", jwt);
                $serverJWT = jwt;
                sessionStorage.setItem("iota.e-commerce.server.key", serverKey);
                sessionStorage.setItem("iota.e-commerce.server.identity", serverIdentity);
                sessionStorage.setItem("iota.e-commerce.server.logged", "true");
                logged = true;
                console.log(await search(jwt));
            }
        }        
        catch (e) {
            console.log(e)
        }
    }

    function doLogout() {
        logout();
        role = null;
    }

    function logout() {
        sessionStorage.removeItem("iota.e-commerce.server.key")
        sessionStorage.removeItem("iota.e-commerce.server.identity")
        sessionStorage.removeItem("iota.e-commerce.server.jwt")
        sessionStorage.removeItem("iota.e-commerce.server.logged")
        serverKey = undefined
        serverIdentity = undefined
        logged = false;
    }

    let name, lastName, jobTitle;
    let creating = false;

    async function doCreateIdentity() {
        console.log(name, lastName, jobTitle)
        creating = true
        let identity = await createIdentity(name, {
            type: "Person",
            name,
            lastName,
            jobTitle,
        });
        console.log(identity);
        creating = false;
        page = null;
        refreshTree()
    }

    let currentIdentity;

    async function selected(data) {
        console.log(data)
        if (data?.nodes?.length > 0) {
            let did = data.nodes[0]
            currentIdentity = await getIdInfo(did)
            return;
        }
        if (data?.edges?.length > 0) {
            let components = data.edges[0].split(";")
            let from = components[0]
            let to = components[1]
            currentIdentity = await getIdInfo(from)
            return;
        }
        currentIdentity = null;
    }

    async function doCredentialCreate(claim) {
        let identity = await getServerIdentity()
        let did = currentIdentity.identityId
        await createCredential(identity, did, claim)
        page = null;
        refreshTree();
    }

</script>

{#if logged}
<ServerMenu bind:page={page} logout={doLogout} />
{/if}

<!-- Login Part -->
<form>
    {#if !logged}
    <div class="form-group">
      <label for="serverKey">Server Key</label>
      <input bind:value={serverKey} type="text" class="form-control" id="serverKey" aria-describedby="serverKeyHelp" placeholder="Enter Server Secret Key">
      <small id="serverKeyHelp" class="form-text text-muted">Secret password of server</small>
    </div>
    <div class="form-group">
        <label for="serverIdentity">Server Identity</label>
        <textarea bind:value={serverIdentity} class="form-control" id="serverIdentity" rows="10"></textarea>
    </div>
    <button on:click|preventDefault={login} type="submit" class="btn btn-primary">Submit</button>
    {/if}
</form>

<!-- Identity Tree -->
{#if logged}

    {#if !page}
    <div class="row">
        <div class="col" transition:fade >
            {#if treeVisible}
                <IdentityTree id="tree1" {selected} />
            {/if}
        </div>
        {#if currentIdentity}
        <div class="col">
            <!-- Did of current Identity -->
            <div class="row" style="width: 100%">
                <form style="width: 100%; font-size: 12px;" >
                    <input value={currentIdentity.identityId} class="form-control" type="text" placeholder="DID" readonly>
                </form>
            </div>
            <!-- Identity Card -->
            <div class="row">
                <div class="col">
                    <IdentityCardController identity={currentIdentity} />
                </div>
                <!--
                {#if currentIdentity?.verifiableCredentials?.length > 0}
                <div class="col">
                    <CredentialForm />
                </div>
                {/if}
                -->
            </div>
            <!-- JSON identity -->
            <div class="row" style="padding: 10px; --json-tree-li-indentation: 2.5em; --json-tree-li-line-height: 2; --json-tree-font-size: 10px;">
                <JSONTree value={currentIdentity} />
            </div>
        </div>
        {/if}        
    </div>
    {/if}

    {#if page === "create-person"}
        {#if !creating}
            <IdentityForm bind:name={name} bind:lastName={lastName} bind:jobTitle={jobTitle} action={doCreateIdentity} />
        {:else}
        <div class="alert alert-warning" role="alert">
            Fasten your seat belt: we are inserting a new identity on IOTA tangle!
        </div>
        {/if}
    {/if}

    {#if page === "create-credential"}
        <div class="row">
            <div class="col"><IdentityTree id="tree2" {selected} /></div>
            <div class="col">
                <div class="row">
                    <ul>
                        <li>Choose identity to verify</li>
                        <li>Drag the claims you need</li>
                        <li>Fill the form</li>
                    </ul>
                </div>
                <div class="row" style="width: 100%"><div class="col">
                    <form style="width: 100%; font-size: 12px;" >
                        <input value={currentIdentity ? currentIdentity.identityId : ''} class="form-control" type="text" placeholder="DID" readonly>
                    </form>
                </div></div>
                <div class="row"><div class="col"><ClaimEditor action={doCredentialCreate} /></div></div>
            </div>
        </div>
        
    {/if}

{/if}


