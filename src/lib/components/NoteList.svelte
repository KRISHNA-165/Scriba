<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import NoteCard from './NoteCard.svelte';
  import LoadingSkeleton from './LoadingSkeleton.svelte';
  import EmptyState from './EmptyState.svelte';
  import type { Note } from '../types';

  export let notes: Note[] = [];
  export let isLoading: boolean = false;
  export let hasActiveSearch: boolean = false;
  
  const dispatch = createEventDispatcher();

  function forwardEdit(e: CustomEvent<Note>) { dispatch('edit', e.detail); }
  function forwardDelete(e: CustomEvent<Note>) { dispatch('delete', e.detail); }
  function forwardTogglePin(e: CustomEvent<Note>) { dispatch('togglePin', e.detail); }
</script>

{#if isLoading && notes.length === 0}
  <LoadingSkeleton count={6} />
{:else if notes.length === 0}
  <EmptyState type={hasActiveSearch ? 'no-results' : 'empty'} />
{:else}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each notes as note (note.id)}
      <div class="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both" style="animation-delay: {notes.indexOf(note) * 30}ms">
        <NoteCard 
          {note} 
          on:edit={forwardEdit}
          on:delete={forwardDelete}
          on:togglePin={forwardTogglePin}
        />
      </div>
    {/each}
  </div>
  
  {#if isLoading}
    <div class="mt-8">
      <!-- Loading more skeletons -->
      <LoadingSkeleton count={3} />
    </div>
  {/if}
{/if}
