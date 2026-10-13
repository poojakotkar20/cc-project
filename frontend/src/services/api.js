/**
 * Tier 1 -> Tier 2 REST API Communication Service
 * Communicates with the Render-hosted Express.js backend.
 */

const getInitialBaseUrl = () => {
  // 1. Check local storage override if user changed it in UI
  const storedUrl = localStorage.getItem('cloudscribe_api_url');
  if (storedUrl) return storedUrl;

  // 2. Check Vite environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  // 3. Fallback to localhost
  return 'http://localhost:5000';
};

let BASE_URL = getInitialBaseUrl();

export const getApiBaseUrl = () => BASE_URL;

export const setApiBaseUrl = (url) => {
  BASE_URL = url.replace(/\/$/, '');
  localStorage.setItem('cloudscribe_api_url', BASE_URL);
};

export const resetApiBaseUrl = () => {
  localStorage.removeItem('cloudscribe_api_url');
  BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : 'http://localhost:5000';
};

// Check Tier 2 (Render) and Tier 3 (MongoDB Atlas) Health
export const checkHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${BASE_URL}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Cannot reach Backend API',
    };
  }
};

// Fetch all posts with filters
export const fetchPosts = async ({ search = '', category = 'All', sort = 'newest' } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'All') params.append('category', category);
  if (sort) params.append('sort', sort);

  const url = `${BASE_URL}/api/posts?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to fetch posts (${response.status})`);
  }
  return response.json();
};

// Fetch single post
export const fetchPostById = async (id) => {
  const response = await fetch(`${BASE_URL}/api/posts/${id}`);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to fetch post (${response.status})`);
  }
  return response.json();
};

// Create new post (Tier 1 -> Tier 2 -> Tier 3)
export const createPost = async (postData) => {
  const response = await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Failed to create post (${response.status})`);
  }
  return data;
};

// Update existing post
export const updatePost = async (id, postData) => {
  const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Failed to update post (${response.status})`);
  }
  return data;
};

// Delete post
export const deletePost = async (id) => {
  const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Failed to delete post (${response.status})`);
  }
  return data;
};

// Like post
export const likePost = async (id) => {
  const response = await fetch(`${BASE_URL}/api/posts/${id}/like`, {
    method: 'PATCH',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Failed to like post');
  }
  return data;
};

// Seed sample posts
export const seedSamplePosts = async (force = false) => {
  const response = await fetch(`${BASE_URL}/api/posts/seed${force ? '?force=true' : ''}`, {
    method: 'POST',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Failed to seed posts');
  }
  return data;
};
