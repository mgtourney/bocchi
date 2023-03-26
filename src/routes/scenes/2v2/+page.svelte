<script lang="ts">
  import ScoreLine from "$lib/components/ScoreLine.svelte";
  import StreamView from "$lib/components/gameview/StreamView.svelte";
  import DiffBar from "$lib/components/DiffBar.svelte";
  let diff: number = 20;

  setTimeout(() => {
    diff = 50;
  }, 1000)
</script>

<div class="flex-col w-full">
  <DiffBar bind:diff/>
  <div class="flex justify-center items-center">
    <div class="flex-col">
      <StreamView playerName="dexter_bs" scale={0.35} muted={false}/>
      <StreamView playerName="knexfreak32" scale={0.35} muted={true}/>
    </div>
    <div class="flex-col w-full">

    </div>
    <div class="flex-col">
      <StreamView playerName="litlmaiden" scale={0.35} muted={true}/>
      <StreamView playerName="sckuffles" scale={0.35} muted={true}/>
    </div>
  </div>
</div>
