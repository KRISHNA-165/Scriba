<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { X } from 'lucide-svelte';
  import NoteForm from './NoteForm.svelte';
  import type { Note } from '../types';

  export let note: Note;
  export let isSubmitting: boolean = false;

  const dispatch = createEventDispatcher();
  let modalRef: HTMLDivElement;

  function handleSave(e: CustomEvent<{title: string, content: string}>) {
    dispatch('save', {
      id: note.id,
      ...e.detail
    });
  }
  
  function handleCancel() { dispatch('cancel'); }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') handleCancel();
  }

  onMount(() => {
    modalRef?.focus();
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
  class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
  on:click|self={handleCancel}
>
  <div 
    bind:this={modalRef}
    tabindex="-1"
    class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden focus:outline-none animate-in fade-in zoom-in duration-200"
    on:keydown={handleKeydown}
  >
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
      <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Edit Note</h2>
      <button 
        on:click={handleCancel}
        class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
      >
        <X size={20} />
      </button>
    </div>
    
    <div class="p-6">
      <NoteForm 
        initialData={{title: note.title, content: note.content}} 
        {isSubmitting} 
        onCancel={handleCancel}
        on:save={handleSave}
        autofocus
      />
    </div>
  </div>
</div>
