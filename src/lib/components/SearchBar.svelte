<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Search } from 'lucide-svelte';
  import { debounce } from '../debounce';
  import { searchFilter } from '../store';

  const dispatch = createEventDispatcher();
  let searchInput = $searchFilter;
  let inputEl: HTMLInputElement;

  // React to store changes if cleared externally
  $: if ($searchFilter === '' && searchInput !== '') {
    searchInput = '';
  }

  const debouncedSearch = debounce((val: string) => {
    searchFilter.set(val);
    dispatch('search', val);
  }, 300);

  function handleInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    searchInput = val;
    debouncedSearch(val);
  }

  // Keyboard shortcut Ctrl+F to focus search? (optional)
  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        inputEl?.focus();
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="relative w-full max-w-md">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Search class="h-5 w-5 text-slate-400" />
  </div>
  <input
    bind:this={inputEl}
    type="text"
    value={searchInput}
    on:input={handleInput}
    placeholder="Search notes... (Ctrl+F)"
    class="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
  />
</div>
