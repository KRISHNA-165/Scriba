<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { formatDistanceToNow } from 'date-fns';
  import { Pin, PinOff, Edit2, Trash2 } from 'lucide-svelte';
  import type { Note } from '../types';

  export let note: Note;

  const dispatch = createEventDispatcher();

  $: parsedDate = Date.parse(note.createdAt) ? new Date(note.createdAt) : new Date();
  
  function handleEdit() { dispatch('edit', note); }
  function handleDelete() { dispatch('delete', note); }
  function handleTogglePin(e: MouseEvent) {
    e.stopPropagation();
    dispatch('togglePin', note);
  }
</script>

<div class="group relative bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all h-48 flex flex-col justify-between overflow-hidden">
  
  {#if note.pinned}
    <div class="absolute right-0 top-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-amber-400 border-l-transparent dark:border-t-amber-500 z-0"></div>
    <Pin class="absolute top-2 right-2 text-white z-10" fill="currentColor" size={14} />
  {/if}

  <div 
    class="relative z-10 flex-grow overflow-hidden cursor-pointer" 
    on:click={handleEdit}
    on:keydown={(e) => e.key === 'Enter' && handleEdit()}
    role="button"
    tabindex="0"
    aria-label="Edit note"
  >
    <h3 class="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1 truncate pr-8">{note.title}</h3>
    <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-4 leading-relaxed">
      {note.content}
    </p>
  </div>

  <div class="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 relative z-10">
    <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
      {formatDistanceToNow(parsedDate, { addSuffix: true })}
    </span>
    
    <div class="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        class="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-md transition-colors"
        on:click={handleTogglePin}
        title={note.pinned ? "Unpin note" : "Pin note"}
      >
        {#if note.pinned}
          <PinOff size={16} />
        {:else}
          <Pin size={16} />
        {/if}
      </button>
      <button 
        class="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
        on:click|stopPropagation={handleEdit}
        title="Edit note"
      >
        <Edit2 size={16} />
      </button>
      <button 
        class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
        on:click|stopPropagation={handleDelete}
        title="Delete note"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
</div>
