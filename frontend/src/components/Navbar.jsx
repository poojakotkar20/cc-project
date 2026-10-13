import React from 'react';
import { 
  PenTool, 
  BookOpen, 
  Sparkles, 
  Search,
  User
} from 'lucide-react';

export default function Navbar({ onOpenCreate, onSeedSample }) {
  return (
    <header style={{ 
      borderBottom: '1px solid var(--border-subtle)', 
      backgroundColor: 'rgba(10, 14, 23, 0.88)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        height: '70px',
        gap: '1rem' 
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
          }}>
            <BookOpen size={20} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.32rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="text-gradient">
              BlogSpace
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button 
            onClick={onSeedSample} 
            className="btn btn-secondary btn-sm"
            title="Populate starter sample articles"
            style={{ fontSize: '0.82rem' }}
          >
            <Sparkles size={14} />
            <span className="desktop-text">Sample Stories</span>
          </button>

          <button 
            onClick={onOpenCreate} 
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.15rem' }}
          >
            <PenTool size={15} />
            <span>Write Story</span>
          </button>

          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-subtle)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            <User size={18} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-text {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
