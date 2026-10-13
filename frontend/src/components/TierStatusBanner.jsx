import React, { useState } from 'react';
import { 
  Cloud, 
  Server, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Settings, 
  Check, 
  Info 
} from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, resetApiBaseUrl } from '../services/api';

export default function TierStatusBanner({ health, checking, onRefresh, onOpenArchitectureModal }) {
  const [showConfig, setShowConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState(getApiBaseUrl());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setApiBaseUrl(customUrl.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    onRefresh();
  };

  const handleResetUrl = () => {
    resetApiBaseUrl();
    setCustomUrl(getApiBaseUrl());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    onRefresh();
  };

  const isBackendHealthy = health?.success && health.data?.status === 'ok';
  const isDbHealthy = health?.success && health.data?.cloudTiers?.database?.connected;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.25rem 1.5rem', 
          borderLeft: '4px solid var(--primary)',
          background: 'rgba(15, 23, 42, 0.85)' 
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '1rem',
          marginBottom: '1rem' 
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-cloud">Three-Tier Architecture Pipeline</span>
              <button 
                onClick={onOpenArchitectureModal}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-secondary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.3rem', 
                  fontSize: '0.78rem', 
                  cursor: 'pointer' 
                }}
              >
                <Info size={14} /> Architecture Docs
              </button>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.25rem' }}>
              Decoupled Multi-Cloud Deployment Status
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="btn btn-secondary btn-sm"
              title="Configure API Endpoint URL"
            >
              <Settings size={15} />
              <span>Configure API</span>
            </button>
            <button 
              onClick={onRefresh} 
              disabled={checking}
              className="btn btn-secondary btn-sm"
              title="Ping Backend & DB Tiers"
            >
              <RefreshCw size={15} className={checking ? 'spin' : ''} />
              <span>{checking ? 'Checking...' : 'Ping Tiers'}</span>
            </button>
          </div>
        </div>

        {/* Three Cloud Tiers Visual Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '1rem',
          alignItems: 'stretch'
        }}>
          {/* Tier 1: Netlify */}
          <div style={{ 
            background: 'rgba(0, 199, 183, 0.05)', 
            border: '1px solid rgba(0, 199, 183, 0.2)', 
            borderRadius: 'var(--radius-md)', 
            padding: '1rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cloud size={18} color="var(--tier-netlify)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--tier-netlify)', textTransform: 'uppercase' }}>
                  Tier 1: Presentation
                </span>
              </div>
              <span className="badge badge-netlify">
                <span className="status-dot online"></span> Active
              </span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>Netlify Cloud Host</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Client SPA (React + Vite) • Serves static assets & UI
            </div>
          </div>

          {/* Tier 2: Render */}
          <div style={{ 
            background: isBackendHealthy ? 'rgba(70, 227, 183, 0.05)' : 'rgba(239, 68, 68, 0.06)', 
            border: `1px solid ${isBackendHealthy ? 'rgba(70, 227, 183, 0.2)' : 'rgba(239, 68, 68, 0.3)'}`, 
            borderRadius: 'var(--radius-md)', 
            padding: '1rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server size={18} color="var(--tier-render)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--tier-render)', textTransform: 'uppercase' }}>
                  Tier 2: Application
                </span>
              </div>
              <span className="badge badge-render">
                <span className={`status-dot ${isBackendHealthy ? 'online' : (checking ? 'connecting' : 'offline')}`}></span>
                {isBackendHealthy ? 'Healthy' : (checking ? 'Pinging...' : 'Offline / Idle')}
              </span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>Render Web Service</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Node/Express REST API • {getApiBaseUrl()}
            </div>
          </div>

          {/* Tier 3: MongoDB Atlas */}
          <div style={{ 
            background: isDbHealthy ? 'rgba(0, 237, 100, 0.05)' : 'rgba(245, 158, 11, 0.06)', 
            border: `1px solid ${isDbHealthy ? 'rgba(0, 237, 100, 0.2)' : 'rgba(245, 158, 11, 0.3)'}`, 
            borderRadius: 'var(--radius-md)', 
            padding: '1rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} color="var(--tier-mongo)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--tier-mongo)', textTransform: 'uppercase' }}>
                  Tier 3: Database
                </span>
              </div>
              <span className="badge badge-mongo">
                <span className={`status-dot ${isDbHealthy ? 'online' : (checking ? 'connecting' : 'offline')}`}></span>
                {isDbHealthy ? 'Connected' : (health?.data?.cloudTiers?.database?.status || 'Waiting')}
              </span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>MongoDB Atlas Cluster</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Managed Cloud NoSQL • {health?.data?.cloudTiers?.database?.dbName ? `DB: ${health.data.cloudTiers.database.dbName}` : 'Collection: posts'}
            </div>
          </div>
        </div>

        {/* API URL Config Tray */}
        {showConfig && (
          <form 
            onSubmit={handleSaveUrl} 
            style={{ 
              marginTop: '1.25rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center'
            }}
          >
            <div style={{ flex: 1, minWidth: '280px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Active Backend API URL (Target Render Web Service):
              </label>
              <input 
                type="text" 
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://your-backend.onrender.com"
                className="form-input"
                style={{ padding: '0.5rem 0.8rem', fontSize: '0.88rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                {savedSuccess ? <Check size={14} /> : null}
                {savedSuccess ? 'Saved!' : 'Save & Reconnect'}
              </button>
              <button type="button" onClick={handleResetUrl} className="btn btn-secondary btn-sm">
                Reset
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
