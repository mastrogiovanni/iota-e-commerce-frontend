<script>
	import QrCode from "svelte-qrcode"
    export let payload;
    export let segmentLength = 40;

    let stringPayload = undefined
    let currentPageIndex = 0;
    let currentPage = undefined;
    let interval = undefined;

    let pages = []

    function parse(text) {
		try {
			let first = text.indexOf(",");
			if (first < 0) {
				return null;
			}
			let pages = text.slice(0, first);
			let second = text.indexOf(",", first + 1);
			if (second < 0) {
				return null;
			}
			let index = text.slice(first + 1, second);
			let data = text.slice(second + 1);
			return {
				pages: parseInt(pages),
				index: parseInt(index),
				data
			};
		}
		catch (e) {
			return null;
		}
	}

    function update() {
        if (!pages.length) {
            return;
        }
        currentPage = pages.length + "," + currentPageIndex + "," + pages[currentPageIndex];
        console.log(parse(currentPage));
        currentPageIndex = currentPageIndex + 1;
        if (currentPageIndex >= pages.length) {
            currentPageIndex = 0;
        }
    }

    function splitInPages(text, length) {
        if (text.length <= length) {
            return [ text ];
        }
        else {
            return [ 
                text.slice(0, length),
                ...splitInPages(text.slice(length), length)
            ]
        }
    }

    $: {
        if (payload) {
            let newStringPayload = JSON.stringify(payload);
            if (newStringPayload !== stringPayload) {
                stringPayload = newStringPayload;
                pages = splitInPages(stringPayload, segmentLength);
                // console.log("Number of pages:", pages.length);
                currentPageIndex = 0;
                if (interval) {
                    clearInterval(interval);
                }
                interval = setInterval(update, 200);
            }
        } 
    }

</script>

<QrCode size="500" value={currentPage} />