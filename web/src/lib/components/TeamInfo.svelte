<script lang="ts">
  export let pos: number = 0;
  export let avatar: string = "/assets/loading.png";
  export let name: string = "Loading...";
  export let members: string = "Loading...";
</script>

{#if pos == 0}
  <div
    class="flex flex-row items-center pt-20 pl-6 space-x-3 w-[900px] h-[100px]"
  >
    <!-- Profile Picture -->
    <img
      src={avatar}
      alt="bobross"
      class="rounded-[34px] w-[102px] h-[102px] m-4 border-[#FFFFFF30] border-[6px] bg-opacity-50"
    />

    <!-- Name -->
    <div class="flex flex-col px-4 w-[900px]">
      <h1 class="team-name text-ellipsis">
        {name}
      </h1>
      <h2 class="team-members text-ellipsis">{members}</h2>
    </div>
  </div>
{:else}
  <!-- Mirrored to the right -->
  <div
    class="flex flex-row-reverse items-center pt-20 pr-6 space-x-3 w-[900px] h-[100px] space-x-reverse"
  >
    <!-- Profile Picture -->
    <img
      src={avatar}
      alt="bobross"
      class="rounded-[34px] w-[102px] h-[102px] m-4 border-[#FFFFFF30] border-[6px] bg-opacity-50"
    />

    <!-- Name -->
    <div class="flex flex-col items-end justify-center px-4 w-[900px]">
      <h1 class="team-name text-ellipsis">
        {name}
      </h1>
      <h2 class="team-members text-ellipsis">{members}</h2>
    </div>
  </div>
{/if}

<style>
  .team-name {
    font-style: normal;
    font-weight: 900;
    font-size: 48px;
    line-height: 56px;
    display: flex;
    color: #FFFFFF;
  }

  .team-members {
    font-style: normal;
    font-weight: 900;
    font-size: 26px;
    line-height: 50px;
    display: flex;
    align-items: flex-end;
    color: #FFFFFF80;
  }
</style>