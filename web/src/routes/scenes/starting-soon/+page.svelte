<script lang="ts">
  import { io } from "$lib/socket";
  import { onDestroy, onMount } from "svelte";
  import { tweened } from "svelte/motion";

  let rawTimestampNow: number = (new Date()).getTime();
  let rawTimestamp: number = (rawTimestampNow + 600000); // Default timer delay = 10min

  onMount(() => io.emit("getPageData"));

  io.on("pageData", (data) => {
    rawTimestampNow = (new Date()).getTime();
    rawTimestamp = new Date(parseInt(data)).getTime();
  });

  $: timerDelta = Math.round(Math.abs(rawTimestamp - rawTimestampNow) / 1000);

  const timer = tweened(600);
  $: timer.set(timerDelta);

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
  }
  $: if ($timer < 0) {
    $timer = 0;
  }

  function getAnimation(minutes: number, seconds: number) {
    if (minutes > 0) return;

    switch (true) {
      case seconds <= 10 && seconds > 5:
        return "animate-pulse text-red-500";
      case seconds <= 5 && seconds > 0:
        return "animate-ping text-red-500";
      case seconds === 0:
        return "animate-pulse text-red-500";
      default:
        return "";
    }
  }

  let int: NodeJS.Timer;

  onMount(() => {
    int = setInterval(() => {
      io.emit("getPageData");
    }, 1000);
  });

  let spin = false;
  io.on("effect", (data) => {
    if (data === "spin") {
      spin = true;
      setTimeout(() => {
        spin = false;
      }, 1000);
    }
  });

  onDestroy(() => {
    clearInterval(int);
  });
</script>

<div class="flex flex-col justify-center items-center h-[100vh]">
  <div class="bg-black bg-opacity-70 p-16 rounded-xl text-center text-white {spin ? 'animate-spin' : ''}">
    <p class="text-8xl font-bold">Starting Soon</p>
    <p class="text-[9rem] font-bold {getAnimation(minutes, seconds)}">
      {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10
        ? "0" + seconds
        : seconds}
    </p>
  </div>
</div>
