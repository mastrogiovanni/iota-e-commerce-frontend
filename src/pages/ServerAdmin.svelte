<script>
  import ClaimEditor from "./../components/ClaimEditor.svelte";
  import JSONTree from "svelte-json-tree";
  import IdentityForm from "./../components/IdentityForm.svelte";
  import ServerMenu from "./../components/ServerMenu.svelte";
  import IdentityTree from "../controllers/IdentityTree.svelte";
  import {
    createCredential,
    createIdentity,
    getIdInfo,
    search,
verifyCredential,
  } from "./../libs/ecommerce.js";
  import { decrypt } from "../libs/utility.js";
  import { fetchAuth } from "../libs/ecommerce.js";
  import { onMount } from "svelte";
  import { serverJWT } from "../libs/store.js";
  import IdentityCardController from "../controllers/IdentityCardController.svelte";
  import { fade } from "svelte/transition";

  export let role;

  let serverKey;
  let serverIdentity;
  let logged;

  let treeVisible = true;

  let page;

  function refreshTree() {
    treeVisible = false;
    setTimeout(() => {
      treeVisible = true;
    });
  }

  onMount(async () => {
    if (
      sessionStorage.getItem("iota.e-commerce.server.key") &&
      sessionStorage.getItem("iota.e-commerce.server.identity") &&
      sessionStorage.getItem("iota.e-commerce.server.logged")
    ) {
      serverKey = sessionStorage.getItem("iota.e-commerce.server.key");
      serverIdentity = sessionStorage.getItem(
        "iota.e-commerce.server.identity"
      );
      logged = JSON.parse(
        sessionStorage.getItem("iota.e-commerce.server.logged")
      );
    }
    if (!$serverJWT) {
      logout();
    }

    serverIdentity = JSON.stringify({
      _id: "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY",
      doc: {
        id: "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY",
        verificationMethod: [
          {
            id: "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY#key-collection-0",
            controller: "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY",
            type: "MerkleKeyCollection2021",
            publicKeyBase58: "112fewfTxegupbye8XDXWqbLbMNkTw6eTjDs7pvzG4FHSw",
          },
        ],
        authentication: [
          {
            id: "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY#key",
            controller: "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY",
            type: "Ed25519VerificationKey2018",
            publicKeyBase58: "BX8gXEznB8zkXEuykk2TuJrzMBzbXPWQ9mC37hoM2Exd",
          },
        ],
        created: "2021-11-12T13:26:19Z",
        updated: "2021-11-12T13:26:19Z",
        previousMessageId:
          "41fa8fb2178b8027333237a514935f98895f3640903cfd66b8205585f802419c",
        proof: {
          type: "JcsEd25519Signature2020",
          verificationMethod: "#key",
          signatureValue:
            "rzRBrinDQcBsQJiSoVmFzNS4y4Fi4jDjwu3jEja4xhMtzzEGTGtj6bQABu65zf8KcbNWMnhNZ4Cfr9F9TNz7Xxt",
        },
      },
      key: {
        type: "ed25519",
        public: "BX8gXEznB8zkXEuykk2TuJrzMBzbXPWQ9mC37hoM2Exd",
        secret:
          "0b8f0abb246cf69b474c89b1084b4d6c,3cdf7942adf10b41426ac95a6670371ff3961b163fcf635b5635fb6904b74463be81039a04e456b010d320f5",
        encoding: "base58",
      },
      txHash:
        "bec9833ad757c3c860302423aaf97be2c06143845a740341e9ada72c4fd43ca9",
      created: {
        $date: "2021-11-12T13:26:27.904Z",
      },
    });

    serverKey = "PpKFhPKJY2efTsN9VkB7WNtYUhX9Utaa";
  });

  async function getServerIdentity() {
    let identity = JSON.parse(serverIdentity);
    let secret = identity?.key?.secret;
    let decrypted = await decrypt(secret, serverKey);
    console.log("Decrypted secret is", decrypted);
    identity.key.secret = decrypted;
    return identity;
  }

  async function login() {
    try {
      let identity = await getServerIdentity();
      let jwt = await fetchAuth(identity);
      if (jwt) {
        sessionStorage.setItem("iota.e-commerce.server.jwt", jwt);
        $serverJWT = jwt;
        sessionStorage.setItem("iota.e-commerce.server.key", serverKey);
        sessionStorage.setItem(
          "iota.e-commerce.server.identity",
          serverIdentity
        );
        sessionStorage.setItem("iota.e-commerce.server.logged", "true");
        logged = true;
        console.log(await search(jwt));
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  function doLogout() {
    logout();
    role = null;
  }

  function logout() {
    sessionStorage.removeItem("iota.e-commerce.server.key");
    sessionStorage.removeItem("iota.e-commerce.server.identity");
    sessionStorage.removeItem("iota.e-commerce.server.jwt");
    sessionStorage.removeItem("iota.e-commerce.server.logged");
    serverKey = undefined;
    serverIdentity = undefined;
    logged = false;
  }

  let name, lastName, jobTitle;
  let creating = false;

  async function doCreateIdentity() {
    console.log(name, lastName, jobTitle);
    creating = true;
    let identity = await createIdentity(name, {
      type: "Person",
      name,
      lastName,
      jobTitle,
    });
    console.log(identity);
    creating = false;
    page = null;
    refreshTree();
  }

  let currentIdentity;

  async function selected(data) {
    console.log(data);
    if (data?.nodes?.length > 0) {
      let did = data.nodes[0];
      currentIdentity = await getIdInfo(did);
      return;
    }
    if (data?.edges?.length > 0) {
      let components = data.edges[0].split(";");
      let from = components[0];
      let to = components[1];
      currentIdentity = await getIdInfo(from);
      return;
    }
    currentIdentity = null;
  }

  async function doCredentialCreate(claim) {
    let identity = await getServerIdentity();
    console.log("Identity", identity);
    console.log("currentIdentity", currentIdentity);
    let did = currentIdentity.identityId;
    await createCredential(identity, did, claim);
    page = null;
    refreshTree();
  }

  let credentialChecking = false;
  let credentialText = "";
  let credentialVerified = undefined;

  async function _verifyCredential() {
    if (credentialText) {
      credentialChecking = true;
      let response = await verifyCredential(JSON.parse(credentialText));
      credentialVerified = response?.isVerified;
      credentialChecking = false;
    }
  }

</script>

{#if logged}
  <ServerMenu bind:page logout={doLogout} />
{/if}

<!-- Login Part -->
<form>
  {#if !logged}
    <div class="form-group">
      <label for="serverKey">Server Key</label>
      <input
        bind:value={serverKey}
        type="text"
        class="form-control"
        id="serverKey"
        aria-describedby="serverKeyHelp"
        placeholder="Enter Server Secret Key"
      />
      <small id="serverKeyHelp" class="form-text text-muted"
        >Secret password of server</small
      >
    </div>
    <div class="form-group">
      <label for="serverIdentity">Server Identity</label>
      <textarea
        bind:value={serverIdentity}
        class="form-control"
        id="serverIdentity"
        rows="10"
      />
    </div>
    <button
      on:click|preventDefault={login}
      type="submit"
      class="btn btn-primary">Submit</button
    >
  {/if}
</form>

<!-- Identity Tree -->
{#if logged}
  {#if !page}
    <div class="row">
      <div class="col" transition:fade>
        {#if treeVisible}
          <IdentityTree id="tree1" {selected} />
        {/if}
      </div>
      {#if currentIdentity}
        <div class="col">
          <!-- Did of current Identity -->
          <div class="row" style="width: 100%">
            <form style="width: 100%; font-size: 12px;">
              <input
                value={currentIdentity.identityId}
                class="form-control"
                type="text"
                placeholder="DID"
                readonly
              />
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
          <div
            class="row"
            style="padding: 10px; --json-tree-li-indentation: 2.5em; --json-tree-li-line-height: 2; --json-tree-font-size: 10px;"
          >
            <JSONTree value={currentIdentity} expanded={true} />
          </div>
        </div>
      {/if}
    </div>
  {/if}

  {#if page === "create-person"}
    {#if !creating}
      <IdentityForm
        bind:name
        bind:lastName
        bind:jobTitle
        action={doCreateIdentity}
      />
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
        <div class="row" style="width: 100%">
          <div class="col">
            <form style="width: 100%; font-size: 12px;">
              <input
                value={currentIdentity ? currentIdentity.identityId : ""}
                class="form-control"
                type="text"
                placeholder="DID"
                readonly
              />
            </form>
          </div>
        </div>
        <div class="row">
          <div class="col"><ClaimEditor action={doCredentialCreate} /></div>
        </div>
      </div>
    </div>
  {/if}

  {#if page === "verify-credential"}
    <div class="row">
      <div class="col">
        <ul>
          <li>Insert here credential to verify</li>
        </ul>
        <div class="row" style="width: 100%">
          <div class="col">
            
            <textarea
              bind:value={credentialText}
              class="form-control"
              id="serverIdentity"
              rows="10"/>
    
          </div>
        </div>
        <div>
          {#if credentialVerified}
            <i class="fas fa-check"></i>
          {:else}
            <i class="far fa-times-circle"></i>        
          {/if}
        </div>
        <div class="row">
          <div class="col">
            <button
            disabled={credentialChecking}
            on:click|preventDefault={_verifyCredential}
            type="submit"
            class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
  {/if}

{/if}
