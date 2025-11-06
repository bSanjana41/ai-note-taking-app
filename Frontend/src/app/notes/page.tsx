'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NoteCard } from '@/components/notes/note-card';
import { NoteEditor } from '@/components/notes/note-editor';
import { SearchBar } from '@/components/notes/search-bar';
import { AIFeaturesModal } from '@/components/notes/ai-features-modal';
import { ThemeToggle } from '@/components/theme-toggle';
import { Plus, LogOut } from 'lucide-react';
import api from '@/lib/api';

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [aiModalNoteId, setAiModalNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const verifyAndLoad = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        // Verify token with backend
        const verifyResponse = await api.get('/auth/verify');
        if (verifyResponse.data.valid) {
          setUser(verifyResponse.data.user);
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(verifyResponse.data.user));
          await fetchNotes();
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setLoading(false);
          router.push('/login');
        }
      } catch (err: any) {
        // Only redirect if it's actually an auth error
        // Network errors shouldn't cause redirect
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setLoading(false);
          router.push('/login');
        } else {
          // For other errors, still try to load notes
          // User might still be authenticated
          console.error('Verification error:', err);
          await fetchNotes();
        }
      }
    };

    verifyAndLoad();
  }, [router]);

  const fetchNotes = async () => {
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await api.get('/notes', { params });
      setNotes(response.data.notes);
      setLoading(false);
    } catch (err: any) {
      // 401 is already handled by interceptor, but check here too
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
        router.push('/login');
      } else {
        // Other errors - still set loading to false
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!loading) {
        fetchNotes();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleSaveNote = async (noteData: any) => {
    try {
      if (noteData._id) {
        await api.put(`/notes/${noteData._id}`, noteData);
      } else {
        await api.post('/notes', noteData);
      }
      setShowEditor(false);
      setEditingNote(null);
      fetchNotes();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete note');
    }
  };

  const handleAIFeatures = (noteId: string) => {
    setAiModalNoteId(noteId);
  };

  const handleAIApply = async (type: 'summary' | 'improve' | 'tags', data: string | string[]) => {
    if (!aiModalNoteId) return;

    try {
      const note = notes.find(n => n._id === aiModalNoteId);
      if (!note) return;

      if (type === 'summary') {
        // Summary is just for display, not applied to note
        return;
      } else if (type === 'improve') {
        await api.put(`/notes/${aiModalNoteId}`, {
          ...note,
          content: data as string,
        });
      } else if (type === 'tags') {
        await api.put(`/notes/${aiModalNoteId}`, {
          ...note,
          tags: data as string[],
        });
      }
      fetchNotes();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to apply AI changes');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Notes</h1>
            {user && <p className="text-sm text-foreground/70">Welcome, {user.name}</p>}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <Button onClick={handleCreateNote}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        {showEditor && (
          <div className="mb-6">
            <NoteEditor
              note={editingNote}
              onSave={handleSaveNote}
              onCancel={() => {
                setShowEditor(false);
                setEditingNote(null);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onAIFeatures={handleAIFeatures}
            />
          ))}
        </div>

        {notes.length === 0 && !showEditor && (
          <div className="text-center py-12">
            <p className="text-foreground/70 mb-4">No notes found. Create your first note!</p>
            <Button onClick={handleCreateNote}>
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          </div>
        )}

        {aiModalNoteId && (
          <AIFeaturesModal
            noteId={aiModalNoteId}
            onClose={() => setAiModalNoteId(null)}
            onApply={handleAIApply}
          />
        )}
      </div>
    </div>
  );
}

