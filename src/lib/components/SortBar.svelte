<script lang="ts">
  import { sortKey, sortDir } from '../store';
  import type { SortKey, SortDir } from '../types';
  import { ArrowDownAZ, ArrowUpZA, Calendar, Hash } from 'lucide-svelte';

  const sortOptions: { value: SortKey; label: string; icon: any }[] = [
    { value: 'createdAt', label: 'Date', icon: Calendar },
    { value: 'title', label: 'Title', icon: ArrowDownAZ },
    { value: 'id', label: 'ID', icon: Hash },
  ];

  function toggleDir() {
    sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
  }
</script>

<div class="flex items-center gap-2">
  <div class="relative">
    <select 
      bind:value={$sortKey}
      class="appearance-none block w-full pl-3 pr-8 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors cursor-pointer"
    >
      {#each sortOptions as option}
        <option value={option.value}>Sort by {option.label}</option>
      {/each}
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>

  <button 
    on:click={toggleDir}
    class="p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    title={`Change to ${$sortDir === 'asc' ? 'descending' : 'ascending'}`}
  >
    {#if $sortDir === 'asc'}
      <ArrowDownAZ size={20} />
    {:else}
      <ArrowUpZA size={20} />
    {/if}
  </button>
</div>
