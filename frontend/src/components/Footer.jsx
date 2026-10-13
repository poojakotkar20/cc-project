import React from 'react';
import { Cloud, Server, Database, Heart, Layers } from 'lucide-react';

export default function Footer({ onOpenArchitecture }) {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-subtle)', 
      marginTop: '4rem', 
      padding: '3rem 0 2rem 0',
      backgroundColor: 'rgba(10, 14, 23, 0.9)'
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
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }} className="text-gradient">
              CloudScribe Platform
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Three-Tier Cloud Web Application Architecture
            </div>
          </div>

          {/* Cloud Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            <span className="badge badge-netlify">
              <Cloud size={13} /> Tier 1: Netlify
            </span>
            <span className="badge badge-render">
              <Server size={13} /> Tier 2: Render
            </span>
            <span className="badge badge-mongo">
              <Database size={13} /> Tier 3: MongoDB Atlas
            </span>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '1rem',
          marginTop: '1.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            Demonstration of decoupled, modular, and scalable multi-cloud computing.
          </div>
          <button
            onClick={onOpenArchitecture}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--primary)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600
            }}
          >
            <Layers size={14} /> View Architecture Diagrams & Test Cases
          </button>
        </div>
      </div>
    </footer>
  );
}
