import App from './App.svelte';
// import App from './components/ClaimEditor.svelte'

const app = new App({
	target: document.body,
	props: {
		configApiKey: '94F5BA49-12B6-4E45-A487-BF91C442276D'
	}
});

export default app;