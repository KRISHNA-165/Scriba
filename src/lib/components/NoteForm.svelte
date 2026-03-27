<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Save, X } from 'lucide-svelte';
  import type { Note } from '../types';

  export let initialData: Partial<Note> = {};
  export let isSubmitting: boolean = false;
  export let onCancel: (() => void) | null = null;
  export let autofocus: boolean = false;

  let title = initialData.title || '';
  let content = initialData.content || '';
  
  let titleInput: HTMLInputElement;

  const dispatch = createEventDispatcher();

  $: isValid = title.trim().length > 0 && content.trim().length > 0;

  function handleSubmit() {
    if (!isValid) return;
    dispatch('save', {
      title: title.trim(),
      content: content.trim()
    });
  }

  onMount(() => {
    if (autofocus && titleInput) {
      setTimeout(() => titleInput.focus(), 100);
    }
  });
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 w-full">
  <div class="mb-4">
    <input 
      bind:this={titleInput}
      type="text" 
      bind:value={title} 
      placeholder="Note Title" 
      class="w-full text-lg font-medium bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
      maxlength={100}
      required
    />
  </div>
  
  <div class="mb-5">
    <textarea 
      bind:value={content} 
      placeholder="Write your note here..." 
      class="w-full h-32 resize-none bg-transparent border-0 focus:ring-0 px-0 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none leading-relaxed"
      required
    ></textarea>
  </div>

  <div class="flex justify-end gap-2 items-center">
    {#if onCancel}
      <button 
        type="button" 
        on:click={onCancel}
        class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm flex items-center gap-1"
        disabled={isSubmitting}
      >
        <X size={16} /> Cancel
      </button>
    {/if}
    <button 
      type="submit" 
      class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      disabled={!isValid || isSubmitting}
    >
      <Save size={16} />
      {isSubmitting ? 'Saving...' : 'Save Note'}
    </button>
  </div>
</form>
