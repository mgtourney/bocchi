<script lang="ts">
    import { tweened } from "svelte/motion";
    let timer = tweened(20 * 60);

    // Decrement timer each second
    setInterval(() => {
        timer.update((n) => n - 1);
    }, 1000);

    // Create the reactive components
    $: minutes = Math.floor($timer / 60);
    $: seconds = Math.floor($timer % 60);
</script>

<div class="flex flex-col justify-center items-center h-[100vh]">
    <div class="bg-black bg-opacity-70 p-12 rounded-xl text-center text-white">
        <p class="text-5xl mb-4 font-bold">Starting Soon</p>
        <p class="text-9xl font-semibold">
            {minutes}:{seconds < 10 ? "0" : ""}{seconds}
        </p>
    </div>
</div>
