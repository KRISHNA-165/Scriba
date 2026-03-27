<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { AlertTriangle, X } from 'lucide-svelte';

  export let title: string = 'Confirm Action';
  export let message: string = 'Are you sure you want to proceed?';
  export let confirmText: string = 'Confirm';
  export let cancelText: string = 'Cancel';
  export let variant: 'danger' | 'primary' = 'danger';

  const dispatch = createEventDispatcher();
  let modalRef: HTMLDivElement;

  function handleConfirm() { dispatch('confirm'); }
  function handleCancel() { dispatch('cancel'); }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') handleCancel();
    // Tab trapping logic can go here for full a11y, simplified for brevity
  }

  onMount(() => {
    // Focus modal to capture Esc key easily
    modalRef?.focus();
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
  class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
  on:click|self={handleCancel}
>
  <div 
    bind:this={modalRef}
    tabindex="-1"
    class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in duration-200 focus:outline-none"
    on:keydown={handleKeydown}
  >
    <div class="flex items-start gap-4">
      <div class={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
        <AlertTriangle size={20} />
      </div>
      <div class="flex-1 mt-0.5">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">{message}</p>
        
        <div class="flex justify-end gap-3">
          <button 
            type="button" 
            class="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            on:click={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            class={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            on:click={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
      
      <button 
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        on:click={handleCancel}
      >
        <X size={20} />
      </button>
    </div>
  </div>
</div>
