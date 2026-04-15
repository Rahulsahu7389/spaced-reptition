import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { BrainCircuit, LogOut, UserCircle2, LayoutDashboard, BookMarked } from 'lucide-react';

export default function Navbar() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
  });

  return (
    <nav className="surface-delicate-elevation mb-8 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-7 h-7" style={{ color: 'var(--accent-primary)' }} />
          <span className="typography-clean-heading text-xl tracking-tight">Algorithmic Arsenal</span>
        </div>

        {/* Nav Links (only when logged in) */}
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <NavLink to="/" end style={navLinkStyle}>
              <LayoutDashboard style={{ width: '15px', height: '15px' }} />
              Dashboard
            </NavLink>
            <NavLink to="/topics" style={navLinkStyle}>
              <BookMarked style={{ width: '15px', height: '15px' }} />
              My Topics
            </NavLink>
          </div>
        )}

        {/* User profile + Logout */}
        {currentUser && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 typography-soft-body text-sm font-medium">
              <UserCircle2 className="w-5 h-5 opacity-70" />
              <span className="hidden sm:inline">{currentUser.email?.split('@')[0] || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-delicate-interaction text-sm"
              style={{ color: 'var(--text-secondary)', padding: '0.4rem 0.85rem', border: '1px solid var(--border-delicate)' }}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
