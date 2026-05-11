import { useState, useCallback } from 'react';

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, show, remove };
}
