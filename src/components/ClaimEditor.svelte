<script>
	// Inspired by https://svelte.dev/repl/810b0f1e16ac4bbd8af8ba25d5e0deff?version=3.4.2.
	import { flip } from "svelte/animate";

	export let action = (dict) => {};

	let attributes = {
		Age: ["birthDate"],
		Work: ["company", "currentRole", "startDate"],
	};

	let baskets = [
		{
			name: "Claims",
			items: ["Age", "Work"],
		},
		{
			name: "Claim Chosen",
			items: [],
		},
	];

	let hoveringOverBasket;

	function dragStart(event, basketIndex, itemIndex) {
		// The data we want to make available when the element is dropped
		// is the index of the item being dragged and
		// the index of the basket from which it is leaving.
		const data = { basketIndex, itemIndex };
		event.dataTransfer.setData("text/plain", JSON.stringify(data));
	}

	function drop(event, basketIndex) {
		event.preventDefault();
		const json = event.dataTransfer.getData("text/plain");
		const data = JSON.parse(json);

		// Remove the item from one basket.
		// Splice returns an array of the deleted elements, just one in this case.
		const [item] = baskets[data.basketIndex].items.splice(
			data.itemIndex,
			1
		);

		// Add the item to the drop target basket.
		baskets[basketIndex].items.push(item);
		baskets = baskets;

		hoveringOverBasket = null;
	}

	let items = [];

	$: {
		items = baskets
			.filter((item) => item.name == "Claim Chosen")[0]
			.items.flatMap((item) => attributes[item]);
	}

	const normalize = (str) =>
		str[0].toUpperCase() +
		str.slice(1).replace(/[A-Z]/g, (letter) => ` ${letter}`);

	function submit() {
		let dict = {};
		items.forEach((item) => {
			dict[item] = document.getElementById(item).value;
		});
		action(dict);
	}
</script>

<div class="container">
	<div class="row">
		{#each baskets as basket, basketIndex (basket)}
			<div class="col" animate:flip>
				<b>{basket.name}</b>
				<ul
					class:hovering={hoveringOverBasket === basket.name}
					on:dragenter={() => (hoveringOverBasket = basket.name)}
					on:dragleave={() => (hoveringOverBasket = null)}
					on:drop={(event) => drop(event, basketIndex)}
					ondragover="return false"
				>
					{#each basket.items as item, itemIndex (item)}
						<div class="item" animate:flip>
							<li
								draggable={true}
								on:dragstart={(event) =>
									dragStart(event, basketIndex, itemIndex)}
							>
								{item}
							</li>
						</div>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
	<div class="row">
		<div class="col">
			<form>
				{#each items as item}
					<div class="form-group">
						<label for={item}>{normalize(item)}</label>
						<input type="text" class="form-control" id={item} />
					</div>
				{/each}
				<button
					type="submit"
					on:click|preventDefault={submit}
					class="btn btn-primary">Create Credential</button
				>
			</form>
		</div>
	</div>
</div>

<style>
	.hovering {
		border-color: orange;
	}
	.item {
		display: inline; /* required for flip to work */
	}
	li {
		background-color: lightgray;
		cursor: pointer;
		display: inline-block;
		margin-right: 10px;
		padding: 10px;
	}
	li:hover {
		background: orange;
		color: white;
	}
	ul {
		border: solid lightgray 1px;
		display: flex; /* required for drag & drop to work when .item display is inline */
		height: 68px; /* needed when empty */
		padding: 10px;
	}
</style>
