'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Sparkles } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onAIFeatures: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete, onAIFeatures }: NoteCardProps) {
  const preview = note.content.length > 150 ? note.content.substring(0, 150) + '...' : note.content;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{note.title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onAIFeatures(note._id)}>
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(note)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(note._id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/70 mb-3">{preview}</p>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-foreground/10 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-foreground/50 mt-2">
          {new Date(note.updatedAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}


