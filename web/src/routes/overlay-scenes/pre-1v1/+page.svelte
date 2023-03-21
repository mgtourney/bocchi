<script lang="ts">
    import { ta } from "$lib/realtime"
    import { onMount } from "svelte"

    // function getMapBackground(hash) {
    //     let stripped = hash.replace("custom_level_", "")
    //     fetch(`https://api.beatsaver.com/maps/hash/${stripped}`).then((res) => {
    //         res.json().then((json) => {
    //             return json.versions[0].coverURL;
    //         })
    //     })
    // }
    function fromNumDiffToDiff(num) {
        switch (num) {
            case 0:
                return "Easy"
            case 1:
                return "Normal"
            case 2:
                return "Hard"
            case 3:
                return "Expert"
            case 4:
                return "Expert+"
            default:
                return ""
        }
    }
</script>

<div class="justify-center items-center h-[100vh] flex">
    <div id="song" class="flex flex-col justify-center items-center">
        <div id="song-cover" class="pb-8">
            <img
                src="https://na.cdn.beatsaver.com/{ta.State.matches.map((match) => match.toObject())[0].selected_level.level_id.replace("custom_level_", "").toLowerCase()}.jpg"
                alt="fuck off"
                class="w-128 h-128 rounded-3xl outline-none outline-4 outline-white/80 outline-offset-0"
            />
        </div>

        <h1 id="song-name" class="text-4xl font-extrabold text-white">
            { ta.State.matches.map((match) => match.toObject())[0].selected_level.name }
        </h1>
        <h1>
            <!-- mapper: {ta.State.matches.map((match) => match.toObject())[0].selected_level.characteristics[0]} -->
        </h1>
        <h1>
            diff: {fromNumDiffToDiff(ta.State.matches.map((match) => match.toObject())[0].selected_level.selected_difficulty)}
        </h1>
    </div>
</div>
