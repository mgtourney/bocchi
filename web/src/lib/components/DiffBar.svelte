<script lang="ts">
  import { spring } from "svelte/motion";
  import { tick } from "svelte";
  export let diff: number;

  // Spring only diff so that the bar doesn't shift around if the diff changes rapidly around 0
  let barDiff = spring(0);
  $: barDiff.set(diff);

  let barLengthR = 0;
  let barLengthL = 0;

  $: barLengthR = $barDiff >= 0 ? (100 - $barDiff) / 2 : 50;
  $: barLengthL = $barDiff < 0 ? (100 - Math.abs($barDiff)) / 2 : 50;

  $: tick();
</script>

<div class="flex w-full h-3">
  <div class="bg-bar" style:width={`${barLengthL * 8}%`} />
  <div class="flex-grow {diff < 0 ? 'bg-blue-600' : 'bg-orange-600'}" />
  <div class="bg-bar" style:width={`${barLengthR * 8}%`} />
</div>

<style>
  .bg-bar {
    background: #ffffff40;
  }
</style>
