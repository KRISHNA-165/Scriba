<script lang="ts">
  export let count: number = 6;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each Array(count) as _}
    <div class="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse h-48 flex flex-col justify-between">
      <div>
        <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
      <div class="h-8 flex justify-between items-end">
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        <div class="flex gap-2">
          <div class="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div class="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        </div>
      </div>
    </div>
  {/each}
</div>
