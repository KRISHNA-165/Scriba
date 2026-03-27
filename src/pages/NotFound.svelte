<script lang="ts">
  import { FileQuestion } from 'lucide-svelte';
  import { navigate } from '../lib/store';
</script>

<div class="min-h-[80vh] flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-300">
  <div class="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-500">
    <FileQuestion size={48} />
  </div>
  <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 items-center gap-2 flex">
    <span class="text-red-500">404</span> Not Found
  </h1>
  <p class="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
    Oops! The page you're looking for doesn't exist or has been moved.
  </p>
  <button 
    on:click={() => navigate('/')}
    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm inline-flex items-center gap-2"
  >
    Return Home
  </button>
</div>
