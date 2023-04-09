<script lang="ts">
  import { spring } from "svelte/motion";
  import { tick } from "svelte";
  export let diff: number;

  let barDiff = spring(0);
  $: barDiff.set(diff);

  let barLengthR = 0;
  let barLengthL = 0;

  $: {
    if ($barDiff > 0) {
      barLengthR = Math.min(100, $barDiff * 100);
      barLengthL = 0;
    } else {
      barLengthL = Math.min(100, -$barDiff * 100);
      barLengthR = 0;
    }
  }
</script>

<div class="flex w-full h-3">
  <div class="bg-bar" style:width={`${barLengthL}%`} />
  <div class="flex-grow {diff < 0 ? 'bg-blue-600' : 'bg-orange-600'}" />
  <div class="bg-bar" style:width={`${barLengthR}%`} />
</div>

<style>
  .bg-bar {
    background: #ffffff40;
  }
</style>
