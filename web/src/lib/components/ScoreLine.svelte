<script lang="ts">
  export let points: number = 0;
</script>

<div>
  <div class:on={points >= 3} class:off={points < 3} class="w-[34px] h-[9px] rounded-3xl m-5"/>
  <div class:on={points >= 2} class:off={points < 2} class="w-[34px] h-[9px] rounded-3xl m-5"/>
  <div class:on={points >= 1} class:off={points < 1} class="w-[34px] h-[9px] rounded-3xl m-5 mb-[24px]"/>
</div>
<style>
  .on {
    background: #FFFFFFFF;
  }

  .off {
    background: #FFFFFF40;
  }
</style>