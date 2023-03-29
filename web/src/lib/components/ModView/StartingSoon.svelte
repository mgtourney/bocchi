<script>
  //import { io } from "$lib/socket";


  let timerMinutes = 10;
  let timerSeconds = 0;

  function apply() {
    let currentDate = new Date();
    currentDate.setSeconds((currentDate.getMinutes() * 60) + currentDate.getSeconds() + (timerMinutes * 60) + timerSeconds);
    // io.emit("message", {
    //   type: "ChangeScene",
    //   page: "starting-soon",
    //   slug: `/${currentDate.getTime()}`
    // })
  }
</script>

<label>
  <h1>Minutes</h1>
  <input type="number" bind:value={timerMinutes} min="0" max="60" />
</label>
<label>
  <h1>Seconds</h1>
  <input type="number" bind:value={timerSeconds} min="0" max="59" />
</label>

<button on:click={apply}>Apply</button>