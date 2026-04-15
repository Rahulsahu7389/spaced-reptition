import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { PlusCircle, Loader2, Link as LinkIcon, Type } from 'lucide-react';

export default function AddTopicForm({ onTopicAdded }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [notesLink, setNotesLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/topics', { title, notesLink });
      onTopicAdded(response.data);
      setTitle('');
      setNotesLink('');
      setIsExpanded(false); // Collapse smoothly after addition
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add topic');
    } finally {
      setLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="mb-10 text-center">
        <button 
          onClick={() => setIsExpanded(true)}
          className="btn-delicate-interaction btn-primary-action shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Algorithm
        </button>
      </div>
    );
  }

  return (
    <div className="surface-delicate-elevation mb-12 overflow-hidden mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="typography-clean-heading text-lg">New Revision Target</h2>
          <button 
            type="button" 
            onClick={() => setIsExpanded(false)}
            className="typography-soft-body text-sm hover:underline"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Type className="w-4 h-4" />
            </span>
            <input
              type="text"
              className="input-soft-border-focus pl-10"
              placeholder="Topic Title (e.g. Fenwick Tree)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <LinkIcon className="w-4 h-4" />
            </span>
            <input
              type="url"
              className="input-soft-border-focus pl-10"
              placeholder="Study Notes URL (Optional)"
              value={notesLink}
              onChange={(e) => setNotesLink(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-delicate-interaction btn-primary-action w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Commit to Arsenal
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
