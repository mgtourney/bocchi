<script lang="ts">
  import { tweened } from "svelte/motion";
  export let diff: number;
  let barLengthR = tweened((100 - diff) / 2);
  let barLengthL = tweened(50);
  $: barLengthR.set((100 - diff) / 2);
  $: barLengthL.set(50);
</script>

<div class="flex w-full h-3">
  <div class="bg-bar" style:width={`${$barLengthL}%`}/>
  <div class="diff-bar flex-grow"/>
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