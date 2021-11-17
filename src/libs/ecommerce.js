import { get } from 'svelte/store';
import { apiKey } from './store.js'
import { getHexEncodedKey, signNonce } from './utility.js'
import { Buffer } from 'buffer';
import { serverJWT } from './store' 

export const verifyCredential = async (credential) => {
	console.log('Checking the credential:', credential?.type?.[1]);
	return await fetch(`/api/v1/verification/check-credential?api-key=${get(apiKey)}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credential)
	}).then(x => x.json())

		/*
	const res = await axios.post(`${Config.baseUrl}/verification/check-credential${apiKey}`, JSON.stringify(credential), axiosOptions);

	if (res?.status === 200) {
		console.log(JSON.stringify(res.data));
		return res?.data?.isVerified;
	}
	return false;
	*/
}

export const getIdInfo = async (did) => {
	try {
		return await fetch(`/api/v1/identities/identity/${did}?api-key=${get(apiKey)}`, {
			headers: {
				'Authorization': 'Bearer ' + get(serverJWT),
			}
		}).then(x => x.json())
	}
	catch (e) { return null; }
}

export const search = async (jwtToken) => {
	try {
		return await fetch(`/api/v1/identities/search?api-key=${get(apiKey)}`, {
			headers: {
				'Authorization': 'Bearer ' + jwtToken,
			}
		}).then(x => x.json())
	}
	catch (e) { return null; }
}

export const latestCredential = async (did) => {
    return await fetch(`/api/v1/verification/latest-document/${did}?api-key=${get(apiKey)}`).then(x => x.json()).catch(() => null)
} 

export const fetchAuth = async (identity) => {
    console.log('requesting nonce to sign...');

    const url = `/api/v1/authentication/prove-ownership/${identity.doc.id}?api-key=${get(apiKey)}`;
    const body = await fetch(url).then(x => x.json());
	
    console.log(body)
    const nonce = body.nonce;
    console.log('received nonce: ', nonce);

    const encodedKey = await getHexEncodedKey(identity.key.secret);
	console.log("Hex encoded Key:", encodedKey)
    const signedNonce = await signNonce(encodedKey, nonce);
    console.log('signed nonce: ', signedNonce);

    console.log('requesting authentication token using signed nonce...', identity.doc.id);
    const response = await fetch(`/api/v1/authentication/prove-ownership/${identity.doc.id}?api-key=${get(apiKey)}`, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ 
			signedNonce 
		})
	}).then(x => x.json());

    return response?.jwt;
};

export const createIdentity = async (username, claim) => {
    let response = await fetch(`/api/v1/identities/create?api-key=${get(apiKey)}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			claim
		})	
	}).then(x => x.json())
    console.log(response)
    return response
}

export const createCredential = async (sourceIdentity, targetDid, claim) => {

    const url = `/api/v1/verification/create-credential?api-key=${get(apiKey)}`;

	// let sourceIdentity = await getIdInfo(sourceDid)
	// sourceIdentity.key.secret = secret;

	let jwtSource = await fetchAuth(sourceIdentity)

	let verifiedIdentity = await getIdInfo(sourceIdentity.doc.id)

	let initiatorVC = verifiedIdentity.verifiableCredentials[0]

    let body = {
        "subject": {
            "identityId": targetDid,
            "credentialType": "VerifiedIdentityCredential",
            "claim": {
                ...claim,
                "type": "Person",
            }
        },
        initiatorVC: initiatorVC
    }

    const response = await fetch(url, {
		method: 'POST',
        headers: { 
			'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtSource}` 
        },
		body: JSON.stringify(body)
	}).then(x => x.json())
	
    // console.log(response.status, response.statusText)
    // console.log(JSON.stringify(response.data, null, 2))

    return response

}