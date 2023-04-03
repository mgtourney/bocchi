<script>
  import { io } from "$lib/socket";


  let timerMinutes = 10;
  let timerSeconds = 0;

  function apply() {
    io.emit("ChangeScene", {
      page: "starting-soon",
      data: `${(new Date()).getTime() + (((timerMinutes * 60) + timerSeconds) * 1000)}`
    })
  }
</script>

<div class="flex flex-row items-center justify-center h-screen w-screen">
  <div class="flex flex-col items-center justify-center bg-black rounded-xl p-16 text-white bg-opacity-30">
    <fieldset>
      <legend class="text-2xl font-bold mb-4 text-center">Starting Soon</legend>
      <div class="flex flex-row items-center justify-center">
        <label class="flex flex-col items-center justify-center mr-4">
          <h1 class="text-xl">Minutes</h1>
          <input class="text-2xl border bg-black  bg-opacity-60 text-white p-2" type="number" bind:value={timerMinutes} min="0" max="59" />
        </label>
        <label class="flex flex-col items-center justify-center ml-4">
          <h1 class="text-xl">Seconds</h1>
          <input class="text-2xl border bg-black bg-opacity-60 text-white p-2" type="number" bind:value={timerSeconds} min="0" max="59" />
        </label>
      </div>
    </fieldset>
    <button class="bg-black rounded border border-gray-400 p-2 mt-4" on:click={apply}>Apply</button>
  </div>
</div>
