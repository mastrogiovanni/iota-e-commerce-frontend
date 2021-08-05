

class IdentitiesStore {

    private let identities;

    constructor() {
        if (!localStorage.getItem("iota.identities")) {
			localStorage.setItem("iota.identities", JSON.stringify("[]"))
		}
        localStorage.
    }





}

export let identitiesStore = new IdentitiesStore();