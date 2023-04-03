<script lang="ts">
  import { tweened } from "svelte/motion";
  import { tick } from "svelte";
  export let diff: number;

  let barLengthR = tweened(0);
  let barLengthL = tweened(0);

  $: barLengthR.set((diff >= 0) ? (100 - diff) / 2 : 50);
  $: barLengthL.set((diff < 0) ? (100 - Math.abs(diff)) / 2 : 50);
  
  $: tick();
</script>

<div class="flex w-full h-3">
  <div class="bg-bar" style:width={`${$barLengthL}%`}/>
  <div class="flex-grow {diff < 0 ? "bg-blue-600": "bg-orange-600"}"/>
  <div class="bg-bar" style:width={`${$barLengthR}%`}/>
</div>
<style>
  .bg-bar {
    background: #FFFFFF40;
  }
</style>