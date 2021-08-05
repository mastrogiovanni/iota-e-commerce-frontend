<script>
    export let name;
    export let lastName;
    export let jobTitle;
    export let action = () => {}
</script>

<h1>Person</h1>

<form>
    <div class="form-row">
        <div class="col">
            <input
                bind:value={name}
                type="text"
                class="form-control"
                placeholder="First name"
            />
        </div>
        <div class="col">
            <input
                bind:value={lastName}
                type="text"
                class="form-control"
                placeholder="Last name"
            />
        </div>
    </div>
    <div class="form-row">
        <div class="col">
            <input
                bind:value={jobTitle}
                type="text"
                class="form-control"
                placeholder="Job title"
            />
        </div>
    </div>
    <button on:click|preventDefault={action} type="submit" class="btn btn-primary">Create Identity</button>
</form>
