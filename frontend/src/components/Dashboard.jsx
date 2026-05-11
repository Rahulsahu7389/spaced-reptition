import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import AddTopicForm from './AddTopicForm';
import ReviewQueue from './ReviewQueue';
import Toast from './Toast';
import useToast from '../hooks/useToast';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toasts, show, remove } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/topics/due');
        setTopics(res.data);
      } catch (err) {
        console.error('Error fetching due topics:', err);
        setError('Failed to securely link to Arsenal database.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleTopicAdded = (newTopic) => {
    show(`"${newTopic.title}" added to your arsenal!`, 'success');
  };

  return (
    <div className="layout-professional-spacing">
      <AddTopicForm onTopicAdded={handleTopicAdded} />

      {error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex items-center justify-center">
          <span className="font-medium">{error}</span>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
          <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: 'var(--accent-primary)' }} />
          <p className="typography-soft-body font-medium tracking-wide">Syncing Arsenal...</p>
        </div>
      ) : (
        <ReviewQueue topics={topics} setTopics={setTopics} showToast={show} />
      )}

      <Toast toasts={toasts} remove={remove} />
    </div>
  );
}
