<script lang="ts">
  import { goto } from "$app/navigation";
  import { tweened } from "svelte/motion";
  
  // const urlParams = "";l//new URLSearchParams(window.location.search);
  // const JsonData = urlParams.get('data');
  // let data = JSON.parse(JsonData!);
  // let timerDelta = 60;
  // if (data != null) {
  //   let currentDate = new Date();
  //   let timerDate = new Date(data.startIn);
  //   timerDelta = Math.round(Math.abs(currentDate.getTime() - timerDate.getTime()) / 1000);
  // }
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
    //goto(`/scenes/${data.nextScene}`);
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
</script>

<div class="flex flex-col justify-center items-center h-[100vh]">
  <div class="bg-black bg-opacity-70 p-16 rounded-xl text-center text-white">
    <p class="text-8xl font-bold">Starting Soon</p>
    <p class="text-[9rem] font-bold {getAnimation(minutes, seconds)}">
      {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10
        ? "0" + seconds
        : seconds}
    </p>
  </div>
</div>
