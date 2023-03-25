<script>
  import ScoreLine from "$lib/components/ScoreLine.svelte";
  import StreamView from "$lib/components/gameview/StreamView.svelte";
</script>

<div class="flex justify-end w-full">
  <div class="flex-col">
    <StreamView playerName="dexter_bs" scale={0.35} muted={false}/>
    <StreamView playerName="knexfreak32" scale={0.35} muted={true}/>
  </div>
  <div class="flex justify-center items-center">
    <ScoreLine points={1}/>
  </div>
  <div class=""/>
  <div class="flex justify-center items-center">
    <ScoreLine points={2}/>
  </div>
  <div class="flex-col">
    <StreamView playerName="litlmaiden" scale={0.35} muted={true}/>
    <StreamView playerName="sckuffles" scale={0.35} muted={true}/>
  </div>
</div>
