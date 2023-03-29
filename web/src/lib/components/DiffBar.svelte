<script lang="ts">
  import { tweened } from "svelte/motion";
  export let diff: number;
  let barLengthR = tweened((diff >= 0) ? (100 - diff) / 2 : 50);
  let barLengthL = tweened((diff < 0) ? (100 - Math.abs(diff)) / 2 : 50);
  $: barLengthR.set((diff >= 0) ? (100 - diff) / 2 : 50);
  $: barLengthL.set((diff < 0) ? (100 - Math.abs(diff)) / 2 : 50);
</script>

<div class="flex w-full h-3">
  <div class="bg-bar" style:width={`${$barLengthL}%`}/>
  <div class="flex-grow diff-bar"/>
  <div class="bg-bar" style:width={`${$barLengthR}%`}/>
</div>
<style>
  .diff-bar {
    background: #FFFFFFFF;
  }

  .bg-bar {
    background: #FFFFFF40;
  }
</style>