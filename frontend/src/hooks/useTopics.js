import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';

export function useTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/topics');
      setTopics(response.data);
    } catch (err) {
      setError('Failed to fetch topics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const toggleStatus = async (topicId) => {
    // Optimistic UI update: flip isActive immediately
    setTopics(prev =>
      prev.map(t => t._id === topicId ? { ...t, isActive: !t.isActive } : t)
    );

    try {
      const response = await api.put(`/topics/${topicId}/toggle-status`);
      // Sync with the actual server response
      setTopics(prev =>
        prev.map(t => t._id === topicId ? response.data : t)
      );
    } catch (err) {
      console.error('Toggle failed:', err);
      // Revert on failure
      setTopics(prev =>
        prev.map(t => t._id === topicId ? { ...t, isActive: !t.isActive } : t)
      );
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      await api.delete(`/topics/${topicId}`);
      setTopics(prev => prev.filter(t => t._id !== topicId));
      return true;
    } catch (err) {
      console.error('Delete failed:', err);
      return false;
    }
  };

  return { topics, loading, error, toggleStatus, deleteTopic, refetch: fetchTopics };
}
