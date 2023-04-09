<script lang="ts">
  import { spring } from "svelte/motion";
  import { tick } from "svelte";
  export let diff: number;

  // Spring only diff so that the bar doesn't shift around if the diff changes rapidly around 0
  let barDiff = spring(0);
  $: barDiff.set(diff * 4);

  let barLengthR = 0;
  let barLengthL = 0;

  $: barLengthR = $barDiff >= 0 ? (100 - $barDiff) / 2 : 50;
  $: barLengthL = $barDiff < 0 ? (100 - Math.abs($barDiff)) / 2 : 50;

  $: tick();
</script>

<div class="flex flex-col items-center w-full">
  <div class="text-sm font-medium text-gray-500 mb-1">DIFFERENCE</div>
  <div class="flex w-full h-3">
    <div class="bg-bar" style:width={`${barLengthL}%`} />
    <div class="flex-grow {diff < 0 ? 'bg-blue-700' : 'bg-orange-700'}" />
    <div class="bg-bar" style:width={`${barLengthR}%`} />
  </div>
</div>

<style>
  .bg-bar {
    background: #ffffff40;
  }
</style>
