<script lang="ts">
  import { tweened } from "svelte/motion";
  let original = 20 * 60; // in seconds
  let timer = tweened(original);

  // Decrement timer each second
  setInterval(() => {
    if ($timer > 0) $timer--;
  }, 1000);

  // Prepend a '0' if the number < 10
  function pad(n: number) {
    return (n < 10 ? "0" : "") + n;
  }

  // Create the reactive components
  $: minutes = pad(Math.floor($timer / 60));
  $: seconds = pad(Math.floor($timer - Math.floor($timer / 60) * 60));
</script>

<div class="flex flex-col justify-center items-center h-[100vh]">
  <div class="font-sans font-black leading-14 text-center text-white">
    <p class="text-5xl">STREAM STARTING</p>
    <p class="text-7xl">{minutes}:{seconds}</p>
  </div>
</div>
