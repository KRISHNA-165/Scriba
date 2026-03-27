<script lang="ts">
  import { Loader2 } from 'lucide-svelte';
  export let size: number = 24;
  export let className: string = '';
</script>

<Loader2 class="animate-spin text-slate-500 dark:text-slate-400 {className}" {size} />
