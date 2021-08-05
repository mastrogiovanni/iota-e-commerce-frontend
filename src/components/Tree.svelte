<script>
    export let selected = async (data) => {}

    export let id;

    import { onMount } from "svelte";

    export let nodes = new vis.DataSet([
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" },
    ]);

    export let edges = new vis.DataSet([
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
    ]);

    onMount(() => {
        // create a network
        var container = document.getElementById(id);

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges,
        };
        var options = {};

        // initialize your network!
        var network = new vis.Network(container, data, options);
        network.on("click", selected)
        network.on("doubleClick", selected)
        
    });
</script>

<div
    id={id}
    style="width: 100%; height: 400px; border: 1px solid lightgray;"
/>
