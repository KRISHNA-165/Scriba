<script lang="ts">
  import { darkMode } from '../store';
  import { Sun, Moon } from 'lucide-svelte';

  function toggle() {
    darkMode.update(v => !v);
  }
</script>

<button 
  on:click={toggle}
  class="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
  aria-label="Toggle dark mode"
  title="Toggle dark mode"
>
  {#if $darkMode}
    <Moon size={20} class="text-blue-400" />
  {:else}
    <Sun size={20} class="text-amber-500" />
  {/if}
</button>
