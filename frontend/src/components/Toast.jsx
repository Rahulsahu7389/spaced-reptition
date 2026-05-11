import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export default function Toast({ toasts, remove }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: 'calc(100vw - 3rem)',
    }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} remove={remove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, remove }) {
  useEffect(() => {
    const timer = setTimeout(() => remove(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, remove]);

  const isSuccess = toast.type === 'success';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.1rem',
      borderRadius: '12px',
      backgroundColor: isSuccess ? 'rgba(16,185,129,0.97)' : 'rgba(244,63,94,0.97)',
      color: '#fff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      fontSize: '0.88rem',
      fontWeight: 600,
      backdropFilter: 'blur(8px)',
      animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      minWidth: '240px',
      maxWidth: '360px',
    }}>
      {isSuccess
        ? <CheckCircle2 style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        : <XCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
      }
      <span style={{ flex: 1 }}>{toast.msg}</span>
      <button
        onClick={() => remove(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', padding: '2px', display: 'flex' }}
      >
        <X style={{ width: '15px', height: '15px' }} />
      </button>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
