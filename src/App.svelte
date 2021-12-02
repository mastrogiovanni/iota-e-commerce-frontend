<script>
	import ServerAdmin from './pages/ServerAdmin.svelte';
	import Entity from './pages/Entity.svelte';
	import { apiKey } from './libs/store.js';
	import { onMount } from "svelte";
	import QrCode from "svelte-qrcode"
    import QrPayload from './components/QRPayload.svelte';
	export let configApiKey;

	let role;

	onMount(async () => {
        $apiKey = configApiKey;
	})

    /*
    let payload = {
        "@context": "https://www.w3.org/2018/credentials/v0.1",
        "id": "did:iota:5SwUyA1T3e9ePZStbFQFt6UTXY2dZsn4FojX4upWumX2",
        "type": [
            "VerifiableCredential",
            "ExamRatingCredential"
        ],
        "credentialSubject": {
            "id": "did:iota:5SwUyA1T3e9ePZStbFQFt6UTXY2dZsn4FojX4upWumX2",
            "grade": 9.8,
            "initiatorId": "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY",
            "professor": "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY",
            "subject": "Mathematic",
            "topic": "Probability Calculation",
            "type": "ExamRating"
        },
        "issuer": "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY",
        "issuanceDate": "2021-11-12T13:41:55Z",
        "proof": {
            "type": "MerkleKeySignature2021",
            "verificationMethod": "#key-collection-0",
            "signatureValue": "BAim4fPNyDbGx2fAPBJLWoSGnjJxBU839G9QfrzLr9wx.1116m5Vtv3vnCJrCrFfwXqS9evnoyRdvRj9dRbUiZ97ztAuBveAhcwoZ16ULpExpcuPrNqjKSPfBodP2ykxTaoM1pnoJCZTgkcyuPUCcpoHFkVoMnScgHDmdi8t8asfdwwRsS6jvFAKHm8yt6qntHTp8AW6aZZMJoiAVKTuiPJko1MywzRX5CGTAPa6GGjwzfJhVyJnmeWhrRaMzCWcZpZ2JZPj6WRCVbsrbTj4F5JGkpAaRxYLU1NEDQvFMmS9GdiUQYV8kwoJMSYyT1MvVsdQojrk2o9krVVzUkxhLdZPrMBupeAvwDupxhDFpxnupxM9CXnvR1awMMPjVVxZSXUDLWNxq8apo52ULP1mSfYM3f6whEiRXNME47YWHAPBHNCxiT2wmNSamvKu8pnMJnmH1jLv9bUTMBdoVPMDPrQAvRyUuRCyf8ctuaug36Qhce8s5n74p1mwHjTjekPqR7swNozaLKJZJSm7cAG9bHDiGQRQDUFmBDwXtAmYNCA5UtFbFZtpNP3SWu8Z9Kgbw8uPJK6eqrbmib.41UQUmTxf2LhwYgEpXL5tbqB5EsTA2gqNY9X4YAf1bNrSASNXpS6bDAWRsATz4PcsNFjjZFchw4Uvif7mcGRAPJA"
        }
    };
    */

    let payload = {
        "id": "did:iota:5SwUyA1T3e9ePZStbFQFt6UTXY2dZsn4FojX4upWumX2",
        "grade": 9.8,
        "initiatorId": "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY",
        "professor": "did:iota:E58bpQCtQvcnGu7Uf2CS5X8VkxX7Sn1V5Kx9zAdsPyWY",
        "subject": "Mathematic",
        "topic": "Probability Calculation",
        "type": "ExamRating"
    };

</script>

<!--
<div class="container">
    <QrPayload payload={payload} />
</div>
-->

<ServerAdmin bind:role={role}></ServerAdmin>

<!--
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
-->
