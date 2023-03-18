<script lang="ts">
  import { tweened } from "svelte/motion";
  let timer = tweened(60);

  // Decrement timer each second
  let interval = setInterval(() => {
    timer.update((n) => n - 1);
  }, 1000);

  // Create the reactive components
  $: minutes = Math.floor($timer / 60);
  $: seconds = Math.floor($timer % 60);

  // If timer is less than or equal to 0, clear the interval
  $: if ($timer <= 0) {
    clearInterval(interval);

    // redirect to the next scene (tbd)
    window.location.href = "/overlay-scenes/starting-soon";
  }
</script>

<div class="flex flex-col justify-center items-center h-[100vh]">
  <div class="bg-black bg-opacity-70 p-16 rounded-xl text-center text-white">
    <p class="text-8xl font-bold">Starting Soon</p>
    <p
      class="text-[9rem] font-bold
        {minutes === 0 && seconds <= 15 ? 'text-red-500 animate-pulse' : ''}
        {minutes === 0 && seconds <= 10 ? 'text-red-500 animate-ping' : ''}
        {minutes === 0 && seconds === 0 ? 'text-red-800' : ''}
        "
    >
      {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10
        ? "0" + seconds
        : seconds}
    </p>
  </div>
</div>
