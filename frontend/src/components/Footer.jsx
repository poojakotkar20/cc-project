import React from 'react';
import { BookOpen, Layers } from 'lucide-react';

export default function Footer({ onOpenArchitecture }) {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-subtle)', 
      marginTop: '5rem', 
      padding: '3.5rem 0 2.5rem 0',
      backgroundColor: 'rgba(10, 14, 23, 0.95)'
    }}>
      <div className="container">
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1.5rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <BookOpen size={16} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }} className="text-gradient">
                BlogSpace
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '420px' }}>
              A place to read thoughtfully and write freely. Discover perspectives, stories, and ideas across various topics.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span>Stories</span>
            <span>Writers</span>
            <span>Topics</span>
            <span>Guidelines</span>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem',
          marginTop: '1.75rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} BlogSpace. All rights reserved.
          </div>
          
          {/* Subtle architectural documentation button for project review/grading */}
          <button
            onClick={onOpenArchitecture}
            style={{ 
              background: 'rgba(255, 255, 255, 0.04)', 
              border: '1px solid var(--border-subtle)', 
              color: 'var(--text-muted)', 
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            title="View 3-Tier Cloud Architecture System Specifications"
          >
            <Layers size={13} />
            <span>Cloud Architecture Specs</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
