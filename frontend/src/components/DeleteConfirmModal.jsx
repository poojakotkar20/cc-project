import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, post, onConfirm, onCancel, deleting }) {
  if (!isOpen || !post) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '420px' }}
      >
        <div style={{ padding: '1.75rem', textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: 'rgba(239, 68, 68, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            color: 'var(--danger)'
          }}>
            <Trash2 size={24} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Delete Story?
          </h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-main)' }}>"{post.title}"</strong>?
            This will permanently remove it from your published stories.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn btn-secondary" 
              disabled={deleting}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={() => onConfirm(post._id)} 
              className="btn btn-danger" 
              disabled={deleting}
              style={{ flex: 1 }}
            >
              <span>{deleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
