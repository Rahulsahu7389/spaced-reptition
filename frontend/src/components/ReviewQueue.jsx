import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { CheckCircle2, RotateCcw, Compass, Clock, Check, ExternalLink } from 'lucide-react';

export default function ReviewQueue({ topics, setTopics, showToast }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleReview = async (id, isSuccess) => {
    setUpdatingId(id);
    try {
      await api.put(`/topics/${id}/review`, { isSuccess });
      setTimeout(() => {
        setTopics(prev => prev.filter(t => t._id !== id));
        setUpdatingId(null);
        showToast(
          isSuccess ? 'Great work! Interval doubled.' : 'No worries — back to day 1.',
          isSuccess ? 'success' : 'error'
        );
      }, 300);
    } catch (error) {
      console.error('Failed to review topic', error);
      showToast('Failed to submit review. Try again.', 'error');
      setUpdatingId(null);
    }
  };

  if (topics.length === 0) {
    return (
      <div className="surface-delicate-elevation text-center p-10 mt-8 flex flex-col items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 rounded-full flex items-center justify-center opacity-80" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
          <Check className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: 'var(--action-positive)' }} />
        </div>
        <h3 className="typography-clean-heading text-xl sm:text-2xl mb-2">All caught up for today!</h3>
        <p className="typography-soft-body text-sm max-w-xs sm:max-w-sm mx-auto">
          Your algorithmic arsenal is sharpened. Keep conquering or add new topics to fuel tomorrow's queue.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 justify-between items-center border-b pb-4 border-gray-100">
        <h2 className="typography-clean-heading text-xl sm:text-2xl flex items-center gap-2 sm:gap-3">
          <Compass className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--accent-primary)' }} />
          Fuel Your Revision Arsenal
        </h2>
        <div className="typography-soft-body flex items-center bg-white px-3 sm:px-4 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs sm:text-sm font-medium">
          <span className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: 'var(--action-rethink)' }}></span>
          {topics.length} Task{topics.length !== 1 ? 's' : ''} Remaining
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
        {topics.map(topic => (
          <div key={topic._id} className="surface-delicate-elevation p-5 sm:p-6 flex flex-col justify-between group">
            <div className="mb-5">
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="typography-clean-heading text-base sm:text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
                  {topic.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center typography-soft-body text-xs gap-1.5 opacity-80">
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

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleReview(topic._id, false)}
                disabled={updatingId === topic._id}
                className="btn-delicate-interaction btn-action-rethink flex-1 text-sm"
              >
                <RotateCcw className={`w-4 h-4 ${updatingId === topic._id ? 'animate-spin' : ''}`} />
                Forgot It
              </button>
              <button
                onClick={() => handleReview(topic._id, true)}
                disabled={updatingId === topic._id}
                className="btn-delicate-interaction btn-action-positive flex-1 text-sm"
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
