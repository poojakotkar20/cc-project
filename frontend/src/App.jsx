import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  SlidersHorizontal,
  CloudLightning
} from 'lucide-react';
import Navbar from './components/Navbar';
import TierStatusBanner from './components/TierStatusBanner';
import PostCard from './components/PostCard';
import PostModal from './components/PostModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ArchitectureModal from './components/ArchitectureModal';
import Footer from './components/Footer';
import { 
  fetchPosts, 
  fetchPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost, 
  seedSamplePosts, 
  checkHealth 
} from './services/api';

const CATEGORIES = [
  'All',
  'Cloud Architecture',
  'Web Development',
  'DevOps & CI/CD',
  'Database Design',
  'System Design',
  'General Tech',
];

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  // Health and Tier status
  const [health, setHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Modals
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view', // 'view' | 'create' | 'edit'
    post: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    post: null,
  });
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);

  // Operation states
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Perform Tier Health Check
  const runHealthCheck = useCallback(async () => {
    setCheckingHealth(true);
    const res = await checkHealth();
    setHealth(res);
    setCheckingHealth(false);
  }, []);

  // Load Posts from REST API (Tier 1 -> Tier 2 -> Tier 3)
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchPosts({ search, category, sort });
      if (res.success) {
        setPosts(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 250); // debounce search
    return () => clearTimeout(timer);
  }, [loadPosts]);

  // Handlers for CRUD Operations
  const handleOpenCreate = () => {
    setModalState({ isOpen: true, mode: 'create', post: null });
  };

  const handleSelectPost = (post) => {
    setModalState({ isOpen: true, mode: 'view', post });
  };

  const handleEditTrigger = (post) => {
    setModalState({ isOpen: true, mode: 'edit', post });
  };

  const handleDeleteTrigger = (post) => {
    setDeleteModal({ isOpen: true, post });
  };

  const handleModalSubmit = async (formData) => {
    try {
      setSubmitting(true);
      if (modalState.mode === 'create') {
        const res = await createPost(formData);
        showToast('Blog post created & saved to MongoDB Atlas!', 'success');
        setModalState({ isOpen: false, mode: 'view', post: null });
        loadPosts();
        runHealthCheck();
      } else if (modalState.mode === 'edit') {
        const res = await updatePost(modalState.post._id, formData);
        showToast('Blog post updated successfully!', 'success');
        setModalState({ isOpen: false, mode: 'view', post: null });
        loadPosts();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async (postId) => {
    try {
      setDeleting(true);
      await deletePost(postId);
      showToast('Post removed from MongoDB Atlas successfully!', 'success');
      setDeleteModal({ isOpen: false, post: null });
      if (modalState.isOpen && modalState.post?._id === postId) {
        setModalState({ isOpen: false, mode: 'view', post: null });
      }
      loadPosts();
    } catch (err) {
      showToast(err.message || 'Failed to delete post', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await likePost(postId);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, likes: res.data.likes } : p))
        );
        if (modalState.post?._id === postId) {
          setModalState((prev) => ({
            ...prev,
            post: { ...prev.post, likes: res.data.likes },
          }));
        }
      }
    } catch (err) {
      showToast('Could not like post', 'error');
    }
  };

  const handleSeed = async () => {
    try {
      setLoading(true);
      const res = await seedSamplePosts(true);
      showToast(res.message || 'Sample posts seeded successfully!', 'success');
      loadPosts();
      runHealthCheck();
    } catch (err) {
      showToast(err.message || 'Seeding failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{ 
          position: 'fixed', 
          bottom: '1.5rem', 
          right: '1.5rem', 
          zIndex: 2000, 
          animation: 'slideUp 0.25s ease' 
        }}>
          <div style={{ 
            background: toast.type === 'success' ? '#064e3b' : '#7f1d1d', 
            color: '#ffffff', 
            padding: '0.85rem 1.25rem', 
            borderRadius: 'var(--radius-md)', 
            boxShadow: 'var(--shadow-md)',
            border: `1px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            {toast.type === 'success' ? <CheckCircle2 size={18} color="#34d399" /> : <AlertCircle size={18} color="#f87171" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar 
        onOpenCreate={handleOpenCreate} 
        onSeedSample={handleSeed}
        onOpenArchitecture={() => setArchitectureModalOpen(true)}
      />

      <main className="container" style={{ flex: 1, padding: '2rem 1.5rem' }}>
        {/* Tier Status Visual Pipeline Banner */}
        <TierStatusBanner 
          health={health}
          checking={checkingHealth}
          onRefresh={() => { runHealthCheck(); loadPosts(); }}
          onOpenArchitectureModal={() => setArchitectureModalOpen(true)}
        />

        {/* Hero Section */}
        <section style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            background: 'rgba(99, 102, 241, 0.1)', 
            padding: '0.35rem 0.85rem', 
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            marginBottom: '1rem' 
          }}>
            <CloudLightning size={14} color="#818cf8" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc' }}>
              Three-Tier Cloud Deployment
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Decoupled Multi-Cloud <span className="text-gradient-cloud">Publishing Platform</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Experience independent cloud layers in harmony: Netlify renders the presentation layer, 
            Render processes the REST business logic, and MongoDB Atlas manages persistent document storage.
          </p>
        </section>

        {/* Filter and Search Bar */}
        <section style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: '1rem',
          marginBottom: '1.75rem' 
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, content or #tag..." 
              className="form-input"
              style={{ paddingLeft: '2.6rem' }}
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={15} color="var(--text-muted)" />
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)} 
              className="form-select"
              style={{ padding: '0.65rem 1rem', width: 'auto' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </section>

        {/* Category Pills */}
        <section style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '0.5rem', 
          paddingBottom: '0.5rem', 
          marginBottom: '2rem',
          scrollbarWidth: 'none'
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                background: category === cat ? 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: category === cat ? '#ffffff' : 'var(--text-secondary)',
                border: category === cat ? '1px solid var(--border-glow)' : '1px solid var(--border-subtle)',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Posts Grid or States */}
        {loading ? (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <RefreshCw size={36} className="spin" style={{ margin: '0 auto 1rem auto', color: 'var(--primary)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Fetching Posts from Render API...</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Tier 1 (Netlify) is calling Tier 2 (Render) ⇄ Tier 3 (MongoDB Atlas)
            </div>
          </div>
        ) : error ? (
          <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <AlertCircle size={44} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Unable to Connect to Backend Tier
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
              {error}
            </p>
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.35)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem', 
              maxWidth: '600px', 
              margin: '0 auto 1.5rem auto',
              textAlign: 'left',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <strong style={{ color: '#ffffff' }}>Troubleshooting Guide:</strong>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', lineHeight: 1.6 }}>
                <li><strong>Local test:</strong> Ensure backend is running (`node server.js` on port 5000).</li>
                <li><strong>Cloud test:</strong> Render free web services take ~30-50s to spin up from sleep.</li>
                <li><strong>Database:</strong> Confirm `MONGODB_URI` is configured in `.env` or Render environment settings.</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => { runHealthCheck(); loadPosts(); }} className="btn btn-primary">
                <RefreshCw size={16} /> Retry Connection
              </button>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.25rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Blog Posts Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
              {search || category !== 'All' 
                ? 'No articles match your current search query or category filter.' 
                : 'The MongoDB Atlas `posts` collection is currently empty.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              {search || category !== 'All' ? (
                <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn btn-secondary">
                  Clear Filters
                </button>
              ) : (
                <>
                  <button onClick={handleSeed} className="btn btn-secondary">
                    <Sparkles size={16} /> Seed Sample Posts
                  </button>
                  <button onClick={handleOpenCreate} className="btn btn-primary">
                    <Plus size={16} /> Write First Article
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.75rem' 
          }}>
            {posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post}
                onSelect={handleSelectPost}
                onEdit={handleEditTrigger}
                onDelete={handleDeleteTrigger}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenArchitecture={() => setArchitectureModalOpen(true)} />

      {/* Post Modal (View / Create / Edit) */}
      <PostModal 
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        post={modalState.post}
        onClose={() => setModalState({ isOpen: false, mode: 'view', post: null })}
        onSubmit={handleModalSubmit}
        onEditTrigger={handleEditTrigger}
        onDeleteTrigger={handleDeleteTrigger}
        onLikeTrigger={handleLike}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        post={deleteModal.post}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, post: null })}
        deleting={deleting}
      />

      {/* Architecture Documentation Modal */}
      <ArchitectureModal 
        isOpen={architectureModalOpen}
        onClose={() => setArchitectureModalOpen(false)}
      />
    </div>
  );
}
