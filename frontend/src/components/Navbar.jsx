import React from 'react';
import { 
  Feather, 
  Plus, 
  Sparkles, 
  Database, 
  Layers, 
  HelpCircle 
} from 'lucide-react';

export default function Navbar({ onOpenCreate, onSeedSample, onOpenArchitecture }) {
  return (
    <header style={{ 
      borderBottom: '1px solid var(--border-subtle)', 
      backgroundColor: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        height: '72px',
        gap: '1rem' 
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Feather size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.28rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="text-gradient">
                CloudScribe
              </span>
              <span className="badge badge-cloud" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                v1.0
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.01em' }}>
              Netlify • Render • MongoDB Atlas
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onOpenArchitecture} 
            className="btn btn-secondary btn-sm"
            title="View 3-Tier Architecture Flowchart & Test Cases"
          >
            <Layers size={16} />
            <span style={{ display: 'none', minWidth: '0' }} className="desktop-text">Architecture</span>
          </button>

          <button 
            onClick={onSeedSample} 
            className="btn btn-secondary btn-sm"
            title="Populate MongoDB Atlas with starter blog records"
          >
            <Sparkles size={16} />
            <span>Seed Posts</span>
          </button>

          <button 
            onClick={onOpenCreate} 
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Write Post</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .desktop-text {
            display: inline !important;
          }
        }
      `}</style>
    </header>
  );
}
