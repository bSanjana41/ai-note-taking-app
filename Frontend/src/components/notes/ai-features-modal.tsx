'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface AIFeaturesModalProps {
  noteId: string;
  onClose: () => void;
  onApply: (type: 'summary' | 'improve' | 'tags', data: string | string[]) => void;
}

export function AIFeaturesModal({ noteId, onClose, onApply }: AIFeaturesModalProps) {
  const [loading, setLoading] = useState<'summary' | 'improve' | 'tags' | null>(null);
  const [summary, setSummary] = useState('');
  const [improvedContent, setImprovedContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleAIAction = async (type: 'summary' | 'improve' | 'tags') => {
    setLoading(type);
    setError('');
    try {
      const response = await api.post(`/ai/notes/${noteId}/${type}`);
      if (type === 'summary') {
        setSummary(response.data.summary);
      } else if (type === 'improve') {
        setImprovedContent(response.data.improvedContent);
      } else if (type === 'tags') {
        setTags(response.data.tags);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'AI request failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Features
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          
          <div className="space-y-2">
            <Button
              onClick={() => handleAIAction('summary')}
              disabled={loading !== null}
              className="w-full"
            >
              {loading === 'summary' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate Summary
            </Button>
            {summary && (
              <div className="p-3 bg-foreground/5 rounded-md">
                <p className="text-sm">{summary}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    onApply('summary', summary);
                    onClose();
                  }}
                >
                  Use Summary
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => handleAIAction('improve')}
              disabled={loading !== null}
              className="w-full"
            >
              {loading === 'improve' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Improve Content
            </Button>
            {improvedContent && (
              <div className="p-3 bg-foreground/5 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{improvedContent}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    onApply('improve', improvedContent);
                    onClose();
                  }}
                >
                  Use Improved Content
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => handleAIAction('tags')}
              disabled={loading !== null}
              className="w-full"
            >
              {loading === 'tags' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate Tags
            </Button>
            {tags.length > 0 && (
              <div className="p-3 bg-foreground/5 rounded-md">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-foreground/10 rounded-md text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onApply('tags', tags);
                    onClose();
                  }}
                >
                  Use Tags
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


