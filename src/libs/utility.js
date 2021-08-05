// import { get } from 'svelte/store';
import * as bs58 from 'bs58';
import { Buffer } from 'buffer';
// import { apiKey } from './store.js'
import ed from './noble-ed25519.js';

function str2ab(str) {
	const buf = new ArrayBuffer(str.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint16Array(buf));
}

const hashNonce = async (nonce) => {
	const encoder = new TextEncoder();
  	const data = encoder.encode(nonce);
  	let hash = await crypto.subtle.digest('SHA-256', data);
	return Buffer.from(hash).toString("hex")
}

export const signNonce = async (privateKey, nonce) => {
	if (nonce?.length !== 40) {
		throw new Error('nonce must have a length of 40 characters!');
	}
	const hash = await hashNonce(nonce);
	console.log(hash)
	return await ed.sign(hash, privateKey);
};

export const getHexEncodedKey = (base58Key) => {
	return bs58.decode(base58Key).toString('hex');
};

/*
	const algorithm = 'aes-256-ctr';
	const splitted = cipher.split(',');
	const iv = splitted[0];
	const hash = splitted[1];
	const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(iv, 'hex'));
	const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
	return decrpyted.toString();

*/
export const decrypt = async (cipher, secret) => {
	const splitted = cipher.split(',');
	const iv = splitted[0];
	const hash = splitted[1];
	let key = await window.crypto.subtle.importKey(
		"raw",
		str2ab(secret),
		"AES-CTR",
		true,
		["encrypt", "decrypt"]
	)
	let decyphered = await window.crypto.subtle.decrypt(
		{
			name: "AES-CTR",
			counter: Buffer.from(iv, 'hex'),
			length: 64
		},
		key,
		Buffer.from(hash, 'hex')
	);
	return Buffer.from(decyphered).toString()
};
