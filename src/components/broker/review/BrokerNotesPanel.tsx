import React, { useState } from 'react';
import { Save, FileText, Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export const BrokerNotesPanel: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', text: 'Please upload more high-resolution photos of the living room.', timestamp: '10:30 AM, Today' },
    { id: '2', text: 'Verify the expected price against recent sales in the same building.', timestamp: '11:15 AM, Today' }
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([{
        id: Date.now().toString(),
        text: newNote,
        timestamp: 'Just now'
      }, ...notes]);
      setNewNote('');
    }
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="bg-white border border-neutral-border rounded-2xl p-5 flex flex-col h-full shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-neutral-divider pb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-neutral-primary">Broker Notes</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 mb-4">
        {notes.length === 0 ? (
          <div className="text-center text-neutral-secondary py-8 text-sm">
            No notes added yet.
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-neutral-bg rounded-xl p-4 border border-neutral-divider group relative">
              <p className="text-sm text-neutral-primary mb-2 leading-relaxed">{note.text}</p>
              <div className="flex justify-between items-center text-xs text-neutral-secondary">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {note.timestamp}</span>
              </div>
              <button 
                onClick={() => removeNote(note.id)}
                className="absolute top-3 right-3 text-neutral-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-neutral-divider">
        <textarea 
          className="w-full bg-neutral-bg border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none mb-3"
          rows={3}
          placeholder="Add a private note about this property..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={addNote} disabled={!newNote.trim()} className="w-full gap-2">
            <Plus className="w-4 h-4" /> Add Note
          </Button>
          <Button variant="outline" className="px-3" title="Save Draft">
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
