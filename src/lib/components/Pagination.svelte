<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  export let currentPage: number = 1;
  export let totalItems: number = 0;
  export let itemsPerPage: number = 20;

  $: totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  $: hasNext = currentPage < totalPages;
  $: hasPrev = currentPage > 1;

  const dispatch = createEventDispatcher();

  function next() {
    if (hasNext) dispatch('change', currentPage + 1);
  }
  
  function prev() {
    if (hasPrev) dispatch('change', currentPage - 1);
  }
</script>

<div class="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 sm:px-6 rounded-xl shadow-sm">
  <div class="flex flex-1 items-center justify-between sm:hidden">
    <button
      on:click={prev}
      disabled={!hasPrev}
      class="relative inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <button
      on:click={next}
      disabled={!hasNext}
      class="relative ml-3 inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
      <p class="text-sm text-slate-700 dark:text-slate-300">
        Showing
        <span class="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span>
        to
        <span class="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span>
        of
        <span class="font-medium">{totalItems}</span>
        results
      </p>
    </div>
    <div>
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <button
          on:click={prev}
          disabled={!hasPrev}
          class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 dark:text-slate-500 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeft class="h-5 w-5" aria-hidden="true" />
        </button>
        
        <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 bg-white dark:bg-slate-800">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          on:click={next}
          disabled={!hasNext}
          class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 dark:text-slate-500 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800"
        >
          <span class="sr-only">Next</span>
          <ChevronRight class="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </div>
</div>
