import React, { useState, useMemo } from 'react';
import { useTopics } from '../hooks/useTopics';
import {
  Search, BookOpen, Archive, Zap, RotateCcw,
  CalendarDays, Timer, AlertCircle, Loader2
} from 'lucide-react';

// ==========================================
// Toggle Switch Sub-Component
// ==========================================
function ToggleSwitch({ isActive, onToggle, disabled }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      title={isActive ? 'Archive this topic' : 'Restore this topic'}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '48px',
        height: '26px',
        borderRadius: '9999px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: isActive ? 'var(--action-positive)' : 'var(--border-delicate)',
        transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.6 : 1,
        flexShrink: 0,
      }}
      aria-checked={isActive}
      role="switch"
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: isActive ? '24px' : '3px',
          width: '20px',
          height: '20px',
          borderRadius: '9999px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </button>
  );
}

// ==========================================
// Filter Pill Sub-Component
// ==========================================
function FilterPill({ label, icon: Icon, isSelected, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 16px',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        border: isSelected ? 'none' : '1px solid var(--border-delicate)',
        backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--surface-color)',
        color: isSelected ? '#fff' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isSelected ? '0 4px 10px rgba(59,130,246,0.25)' : 'none',
      }}
    >
      {Icon && <Icon style={{ width: '13px', height: '13px' }} />}
      {label}
      {count !== undefined && (
        <span style={{
          backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--background-base)',
          padding: '1px 7px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

// ==========================================
// Format date to a readable short format
// ==========================================
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

// ==========================================
// Main TopicManager Component
// ==========================================
export default function TopicManager() {
  const { topics, loading, error, toggleStatus } = useTopics();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'archived'
  const [togglingId, setTogglingId] = useState(null);

  const handleToggle = async (id) => {
    setTogglingId(id);
    await toggleStatus(id);
    setTogglingId(null);
  };

  const filteredTopics = useMemo(() => {
    return topics
      .filter(t => {
        if (filter === 'active') return t.isActive;
        if (filter === 'archived') return !t.isActive;
        return true;
      })
      .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [topics, filter, search]);

  const counts = useMemo(() => ({
    all: topics.length,
    active: topics.filter(t => t.isActive).length,
    archived: topics.filter(t => !t.isActive).length,
  }), [topics]);

  return (
    <div className="layout-professional-spacing">
      {/* ─── Header ─── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="typography-clean-heading" style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>
          Topic Command Center
        </h1>
        <p className="typography-soft-body" style={{ fontSize: '0.9rem' }}>
          Manage and archive topics across your revision arsenal.
        </p>
      </div>

      {/* ─── Controls Bar ─── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <FilterPill label="All"      icon={Zap}     isSelected={filter === 'all'}      onClick={() => setFilter('all')}      count={counts.all} />
          <FilterPill label="Active"   icon={BookOpen} isSelected={filter === 'active'}   onClick={() => setFilter('active')}   count={counts.active} />
          <FilterPill label="Archived" icon={Archive}  isSelected={filter === 'archived'} onClick={() => setFilter('archived')} count={counts.archived} />
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '320px' }}>
          <Search style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            width: '16px', height: '16px', color: 'var(--text-secondary)',
          }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="input-soft-border-focus"
            style={{ paddingLeft: '40px', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* ─── Content ─── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', opacity: 0.6 }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <p className="typography-soft-body">Loading your arsenal...</p>
        </div>
      ) : error ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1.25rem', borderRadius: 'var(--radius-soft)',
          backgroundColor: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.15)',
          color: 'var(--action-rethink)',
        }}>
          <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{error}</span>
        </div>
      ) : filteredTopics.length === 0 ? (
        /* Empty State */
        <div className="surface-delicate-elevation" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1.5rem',
            backgroundColor: 'rgba(59,130,246,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {search ? <Search style={{ width: '28px', height: '28px', color: 'var(--accent-primary)', opacity: 0.7 }} />
                    : <BookOpen style={{ width: '28px', height: '28px', color: 'var(--accent-primary)', opacity: 0.7 }} />}
          </div>
          <h3 className="typography-clean-heading" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>
            {search ? `No results for "${search}"` : 'No topics here yet'}
          </h3>
          <p className="typography-soft-body" style={{ fontSize: '0.875rem', maxWidth: '320px', margin: '0 auto' }}>
            {search ? 'Try a different search term or change your filter.' : 'Add your first algorithm from the Dashboard to get started.'}
          </p>
        </div>
      ) : (
        /* Topic List Table */
        <div className="surface-delicate-elevation" style={{ overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 160px 150px 70px',
            gap: '1rem',
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid var(--border-delicate)',
            backgroundColor: 'var(--background-base)',
          }}>
            {['Topic', 'Interval', 'Next Review', 'Active'].map(h => (
              <span key={h} style={{
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'var(--text-secondary)',
              }}>
                {h}
              </span>
            ))}
          </div>

          {/* Topic Rows */}
          <div>
            {filteredTopics.map((topic, idx) => (
              <div
                key={topic._id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 160px 150px 70px',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  borderBottom: idx < filteredTopics.length - 1 ? '1px solid var(--border-delicate)' : 'none',
                  backgroundColor: topic.isActive ? 'var(--surface-color)' : 'var(--background-base)',
                  opacity: topic.isActive ? 1 : 0.6,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className="topic-row"
              >
                {/* Title */}
                <div>
                  <p style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                    textDecoration: topic.isActive ? 'none' : 'line-through',
                    transition: 'all 0.25s',
                  }}>
                    {topic.title}
                  </p>
                  {topic.notesLink && (
                    <a
                      href={topic.notesLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-subtle-hover"
                      style={{ fontSize: '0.75rem' }}
                    >
                      View Notes ↗
                    </a>
                  )}
                </div>

                {/* Interval */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Timer style={{ width: '14px', height: '14px', color: 'var(--text-secondary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Every {topic.interval} day{topic.interval !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Next Review */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarDays style={{ width: '14px', height: '14px', color: 'var(--text-secondary)', flexShrink: 0 }} />
                  <span style={{
                    fontSize: '0.85rem',
                    color: formatDate(topic.nextReview) === 'Overdue' ? 'var(--action-rethink)' : 'var(--text-secondary)',
                    fontWeight: formatDate(topic.nextReview) === 'Overdue' ? 600 : 400,
                  }}>
                    {topic.isActive ? formatDate(topic.nextReview) : '—'}
                  </span>
                </div>

                {/* Toggle */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ToggleSwitch
                    isActive={topic.isActive}
                    onToggle={() => handleToggle(topic._id)}
                    disabled={togglingId === topic._id}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row hover styles injected globally */}
      <style>{`
        .topic-row:hover {
          background-color: rgba(59, 130, 246, 0.03) !important;
        }
      `}</style>
    </div>
  );
}
