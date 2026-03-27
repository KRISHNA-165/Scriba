<script lang="ts">
  import { FileQuestion, FileX2 } from 'lucide-svelte';
  
  export let type: 'no-results' | 'empty' = 'empty';
  export let message: string = type === 'empty' ? "You don't have any notes yet." : "No notes match your search.";
</script>

<div class="flex flex-col items-center justify-center py-20 px-4 text-center">
  <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
    {#if type === 'empty'}
      <FileQuestion size={32} />
    {:else}
      <FileX2 size={32} />
    {/if}
  </div>
  <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
    {type === 'empty' ? 'No notes found' : 'No results'}
  </h3>
  <p class="text-slate-500 dark:text-slate-400 max-w-sm">
    {message}
  </p>
</div>
