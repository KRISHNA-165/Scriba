<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Plus } from 'lucide-svelte';
  
  import { notes, searchFilter, sortKey, sortDir, syncStatus } from '../lib/store';
  import { getNotes, createNote, updateNote, deleteNote } from '../lib/api';
  import { queueAction } from '../lib/offline';
  import type { Note } from '../lib/types';
  
  import NoteList from '../lib/components/NoteList.svelte';
  import NoteForm from '../lib/components/NoteForm.svelte';
  import EditModal from '../lib/components/EditModal.svelte';
  import ConfirmModal from '../lib/components/ConfirmModal.svelte';
  import Pagination from '../lib/components/Pagination.svelte';
  import SearchBar from '../lib/components/SearchBar.svelte';
  import SortBar from '../lib/components/SortBar.svelte';
  import DarkModeToggle from '../lib/components/DarkModeToggle.svelte';

  let isLoading = true;
  let isCreating = false;
  let showCreateForm = false;
  
  let editingNote: Note | null = null;
  let isEditing = false;
  
  let deletingNote: Note | null = null;
  
  let page = 1;
  const limit = 20;

  $: hasActiveSearch = $searchFilter.trim().length > 0;
  
  // A pseudo "total items" to keep pagination simple without header parsing
  $: totalItems = ($notes.length === limit ? page * limit + 1 : (page - 1) * limit + $notes.length);
  
  // Sort pinned items first
  $: sortedNotes = [...$notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    return 0; // The actual sort API already sorts the rest by sortKey
  });

  async function fetchNotes() {
    isLoading = true;
    try {
      const result = await getNotes(page, limit, $searchFilter, $sortKey, $sortDir);
      notes.set(result);
    } catch (e) {
      if ($syncStatus !== 'offline') toast.error('Failed to load notes');
    } finally {
      isLoading = false;
    }
  }

  // React to search or sort changing
  $: {
    if ($searchFilter !== undefined || $sortKey !== undefined || $sortDir !== undefined) {
      page = 1;
      fetchNotes();
    }
  }

  // Reload when page changes
  $: if (page) fetchNotes();

  async function handleCreate(e: CustomEvent<{title: string, content: string}>) {
    const payload = e.detail;
    isCreating = true;
    
    // Optimistic Note
    const tmpId = 'tmp-' + Date.now();
    const newNote: Note = {
      id: tmpId,
      ...payload,
      createdAt: new Date().toISOString()
    };
    
    notes.update(n => [newNote, ...n]);
    showCreateForm = false;

    if ($syncStatus === 'offline') {
      queueAction({ type: 'CREATE', payload, tmpId });
      toast.success('Note saved offline');
    } else {
      try {
        const created = await createNote(payload);
        notes.update(n => n.map(note => note.id === tmpId ? created : note));
        toast.success('Note created');
      } catch (err) {
        // Fallback to offline queue if online request fails
        queueAction({ type: 'CREATE', payload, tmpId });
        toast.info('Note saved to local queue (sync pending)');
      }
    }
    isCreating = false;
  }

  async function handleUpdate(e: CustomEvent<Partial<Note> & { id: string }>) {
    const { id, ...payload } = e.detail;
    isEditing = true;
    
    // Optimistic UI
    let ogNote: Note | undefined;
    notes.update(n => {
      return n.map(note => {
        if (note.id === id) {
          ogNote = { ...note };
          return { ...note, ...payload };
        }
        return note;
      });
    });

    editingNote = null;

    if ($syncStatus === 'offline') {
      queueAction({ type: 'UPDATE', id, payload });
      toast.success('Edit saved offline');
    } else {
      try {
        await updateNote(id, payload);
        toast.success('Note updated');
      } catch (err) {
        // Fallback to offline queue if online request fails
        queueAction({ type: 'UPDATE', id, payload });
        toast.info('Edit saved to local queue (sync pending)');
      }
    }
    isEditing = false;
  }

  function handleTogglePin(e: CustomEvent<Note>) {
    const target = e.detail;
    handleUpdate(new CustomEvent('save', { detail: { id: target.id, pinned: !target.pinned }}));
  }

  function softDelete(note: Note) {
    // Remove it from UI instantly
    notes.update(n => n.filter(x => x.id !== note.id));
    
    // Show undo toast
    let cancelled = false;
    const toastId = toast(`"${note.title}" deleted`, {
      duration: 10000,
      action: {
        label: 'Undo',
        onClick: () => {
          cancelled = true;
          notes.update(n => [note, ...n]);
          toast.success('Deletion undone');
        }
      },
      onAutoClose: async () => {
        if (!cancelled) proceedWithDelete(note);
      },
      onDismiss: async () => {
        if (!cancelled) proceedWithDelete(note);
      }
    });
  }

  async function proceedWithDelete(note: Note) {
    if ($syncStatus === 'offline') {
      queueAction({ type: 'DELETE', id: note.id });
    } else {
      try {
        await deleteNote(note.id);
      } catch (err: any) {
        // If it's already deleted (404), we don't need to do anything
        if (err.message?.includes('404')) return;
        
        // Fallback to offline queue for other failures
        queueAction({ type: 'DELETE', id: note.id });
        toast.info('Deletion queued for sync');
      }
    }
  }

  onMount(() => {
    fetchNotes();
    
    // Keyboard shortcuts
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showCreateForm = !showCreateForm;
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="flex flex-col gap-6 md:gap-8 min-h-[85vh]">
  
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Your Notes</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">Capture your ideas easily.</p>
    </div>
    
    <div class="flex items-center gap-3 self-end md:self-auto">
      <DarkModeToggle />
      <button 
        on:click={() => showCreateForm = !showCreateForm}
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center gap-2"
        title="Shortcut: Ctrl+N"
      >
        <Plus size={20} />
        <span>New Note</span>
      </button>
    </div>
  </div>

  <div class="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-2">
    <div class="w-full md:w-96">
      <SearchBar />
    </div>
    <div class="w-full md:w-auto mt-2 md:mt-0">
      <SortBar />
    </div>
  </div>

  {#if showCreateForm}
    <div class="mb-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <NoteForm 
        onCancel={() => showCreateForm = false}
        on:save={handleCreate}
        isSubmitting={isCreating}
        autofocus
      />
    </div>
  {/if}

  <div class="flex-grow">
    <NoteList 
      notes={sortedNotes} 
      {isLoading} 
      {hasActiveSearch}
      on:edit={(e) => editingNote = e.detail}
      on:delete={(e) => deletingNote = e.detail}
      on:togglePin={handleTogglePin}
    />
  </div>

  {#if !isLoading && $notes.length > 0}
    <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
      <Pagination 
        bind:currentPage={page}
        {totalItems}
        itemsPerPage={limit}
        on:change={(e) => page = e.detail}
      />
    </div>
  {/if}
</div>

{#if editingNote}
  <EditModal 
    note={editingNote} 
    on:save={handleUpdate}
    on:cancel={() => editingNote = null}
    isSubmitting={isEditing}
  />
{/if}

{#if deletingNote}
  <ConfirmModal 
    title="Delete Note"
    message={`Are you sure you want to delete "${deletingNote.title}"? This action can be undone for 10 seconds before it's permanent.`}
    confirmText="Delete Note"
    on:confirm={() => {
      const note = deletingNote;
      deletingNote = null;
      if (note) softDelete(note);
    }}
    on:cancel={() => deletingNote = null}
  />
{/if}
