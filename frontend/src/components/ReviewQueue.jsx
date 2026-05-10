import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { CheckCircle2, RotateCcw, Compass, Clock, Check, ExternalLink } from 'lucide-react';

export default function ReviewQueue({ topics, setTopics }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleReview = async (id, isSuccess) => {
    setUpdatingId(id);
    try {
      await api.put(`/topics/${id}/review`, { isSuccess });
      setTimeout(() => {
        setTopics(prev => prev.filter(topic => topic._id !== id));
        setUpdatingId(null);
      }, 300);
      
    } catch (error) {
      console.error('Failed to review topic', error);
      alert('Failed to submit review. Try again.');
      setUpdatingId(null);
    }
  };

  if (topics.length === 0) {
    return (
      <div className="surface-delicate-elevation text-center p-12 mt-8 flex flex-col items-center justify-center">
        <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center opacity-80" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)'}}>
          <Check className="w-10 h-10" style={{ color: 'var(--action-positive)' }} />
        </div>
        <h3 className="typography-clean-heading text-2xl mb-2">All caught up for today!</h3>
        <p className="typography-soft-body max-w-sm mx-auto">
          Your algorithmic arsenal is sharpened. Keep conquering or add new topics to fuel tomorrow's queue.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center border-b pb-4 border-gray-100">
        <h2 className="typography-clean-heading text-2xl flex items-center gap-3">
          <Compass className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
          Fuel Your Revision Arsenal
        </h2>
        <div className="typography-soft-body flex items-center bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm text-sm font-medium">
          <span className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: 'var(--action-rethink)' }}></span>
          {topics.length} Task{topics.length !== 1 ? 's' : ''} Remaining
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {topics.map(topic => (
          <div key={topic._id} className="surface-delicate-elevation p-6 flex flex-col justify-between group">
            <div className="mb-6">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="typography-clean-heading text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
                  {topic.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center typography-soft-body text-xs gap-1.5 opacity-80" title="Current repetition interval">
                  <Clock className="w-3.5 h-3.5" />
                  Interval: <strong>{topic.interval}d</strong>
                </div>

                {topic.notesLink && (
                  <a 
                    href={topic.notesLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-subtle-hover flex items-center gap-1 text-xs font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Review Notes
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleReview(topic._id, false)}
                disabled={updatingId === topic._id}
                className="btn-delicate-interaction btn-action-rethink flex-1"
                title="Reset interval to 1 day"
              >
                <RotateCcw className={`w-4 h-4 ${updatingId === topic._id ? 'animate-spin' : ''}`} />
                Forgot It
              </button>
              <button
                onClick={() => handleReview(topic._id, true)}
                disabled={updatingId === topic._id}
                className="btn-delicate-interaction btn-action-positive flex-1"
                title="Double the current interval"
              >
                {updatingId === topic._id ? 'Updating...' : <><CheckCircle2 className="w-4 h-4" /> Got It</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
