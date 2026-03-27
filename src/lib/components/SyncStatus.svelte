<script lang="ts">
  import { syncStatus } from '../store';
  import { Wifi, WifiOff, RefreshCw } from 'lucide-svelte';
</script>

{#if $syncStatus !== 'online'}
  <div class="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-colors
    {$syncStatus === 'offline' ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800' : 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800'}
  ">
    {#if $syncStatus === 'offline'}
      <WifiOff size={16} />
      <span>Offline (changes saved locally)</span>
    {:else if $syncStatus === 'syncing'}
      <RefreshCw size={16} class="animate-spin" />
      <span>Syncing changes...</span>
    {/if}
  </div>
{/if}
