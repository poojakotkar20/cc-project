const mongoose = require('mongoose');
const Post = require('../models/Post');

// Sample initial posts for seeding on BlogSpace
const initialSeedPosts = [
  {
    _id: '670c1a1e1b2c3d4e5f607080',
    title: 'Welcome to BlogSpace: Building on a 3-Tier Cloud Architecture',
    author: 'Pooja (Admin)',
    category: 'Cloud & Architecture',
    tags: ['Netlify', 'Render', 'MongoDB', 'ThreeTier'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    content: `Welcome to **BlogSpace** — a modern cloud platform crafted for readers to discover insights and writers to express ideas.

Behind the scenes, BlogSpace runs on a decoupled Three-Tier Cloud Architecture:
1. **Tier 1 (Presentation Layer - Netlify)**: Delivers a lightning-fast React single-page app with live search, filters, and reader modes.
2. **Tier 2 (Application Layer - Render)**: Manages REST API routing, validates submissions, enforces CORS policies, and coordinates business logic.
3. **Tier 3 (Database Layer - MongoDB Atlas)**: Safely persists and indexes articles, claps, and categories in a managed cloud cluster.

Every time you read, write, edit, or delete a post, requests flow seamlessly across this cloud triad!`,
    excerpt: 'Explore how BlogSpace connects Netlify, Render, and MongoDB Atlas into an intuitive, responsive reading and writing platform.',
    readTime: '3 min read',
    likes: 54,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: '670c1a1e1b2c3d4e5f607081',
    title: 'The Art of Deep Work: How Modern Creators Stay Productive',
    author: 'Elena Vance',
    category: 'Productivity & Life',
    tags: ['Productivity', 'Focus', 'Creativity', 'Writing'],
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    content: `In an era of relentless notifications and algorithmically generated noise, deep concentration has become a superpower.

To protect your creative writing flow:
- Block out uninterrupted 90-minute writing windows early in the day.
- Keep your workspace minimal and distraction-free.
- Write your initial thoughts without editing simultaneously.
- Review your drafts with a clear mind before hitting publish.

Consistency beats intensity every single time. Happy writing on BlogSpace!`,
    excerpt: 'Essential strategies for writers and developers to cultivate deep focus and build lasting publishing habits.',
    readTime: '4 min read',
    likes: 38,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: '670c1a1e1b2c3d4e5f607082',
    title: 'Next-Generation Web Interfaces: Micro-interactions and Glassmorphism',
    author: 'Marcus Chen',
    category: 'Design & UI/UX',
    tags: ['Design', 'CSS', 'UIUX', 'Frontend'],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    content: `Modern web readers expect digital experiences that feel tangible, responsive, and delightful.

Subtle design touches make a world of difference:
- **Translucent Backdrop Blurs**: Glass panels that softly blend with deep radial gradients.
- **Micro-interactions**: Subtle hover elevations, pulsing tier status dots, and smooth transitions.
- **Readable Typography**: Balanced contrast ratios and generous line-heights that reduce eye strain during long-form reading.

Good design is invisible when reading, but memorable upon reflection.`,
    excerpt: 'How refined visual tokens and fluid CSS elevate everyday reading experiences into stunning digital spaces.',
    readTime: '3 min read',
    likes: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '670c1a1e1b2c3d4e5f607083',
    title: 'Understanding REST APIs and Cross-Origin Resource Sharing (CORS)',
    author: 'Dev Advocate',
    category: 'Technology & AI',
    tags: ['WebDev', 'APIs', 'Express', 'Security'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    content: `When your frontend is hosted on Netlify and your backend is deployed on Render, browsers enforce cross-origin constraints.

Understanding the handshake:
- The browser dispatches preflight OPTIONS requests for non-simple calls.
- Render validates the origin header against allowed production domains.
- Upon approval, JSON payloads flow securely between the presentation and application tiers.

Configuring CORS with explicit environment variables ensures your public API remains protected while keeping communication seamless.`,
    excerpt: 'A practical breakdown of how browsers, REST APIs, and multi-domain cloud services interact securely.',
    readTime: '4 min read',
    likes: 29,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// In-Memory store used automatically when MongoDB Atlas is disconnected or not yet configured in .env
let memoryPosts = [...initialSeedPosts];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to compute reading time
const calcReadTime = (content) => {
  const words = (content || '').trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

// Helper to compute excerpt
const calcExcerpt = (content) => {
  const stripped = (content || '').replace(/[#*`_~]/g, '');
  return stripped.length > 150 ? stripped.substring(0, 147) + '...' : stripped;
};

// @desc    Get all blog posts (with optional search and category filter)
// @route   GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (category && category !== 'All') query.category = category;

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { content: searchRegex },
          { author: searchRegex },
          { tags: { $in: [searchRegex] } },
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'oldest') sortOption = { createdAt: 1 };
      if (sort === 'popular') sortOption = { likes: -1 };

      const posts = await Post.find(query).sort(sortOption);
      return res.status(200).json({ success: true, count: posts.length, data: posts, source: 'MongoDB Atlas' });
    }

    // In-memory fallback
    let filtered = [...memoryPosts];

    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'popular') {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
      source: 'Local Memory Fallback (Configure MONGODB_URI in .env to sync with Atlas)',
    });
  } catch (error) {
    console.error('Error in getPosts:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog posts',
      error: error.message,
    });
  }
};

// @desc    Get single blog post by ID
// @route   GET /api/posts/:id
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Post ID format' });
      }
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: `Post with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, data: post });
    }

    // In-memory fallback
    const post = memoryPosts.find((p) => String(p._id) === String(id));
    if (!post) {
      return res.status(404).json({ success: false, message: `Post with ID ${id} not found` });
    }
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error('Error in getPostById:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog post',
      error: error.message,
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { title, content, author, category, tags, coverImage } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    let formattedTags = [];
    if (Array.isArray(tags)) {
      formattedTags = tags;
    } else if (typeof tags === 'string' && tags.trim().length > 0) {
      formattedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const postPayload = {
      title: title.trim(),
      content: content.trim(),
      excerpt: calcExcerpt(content.trim()),
      author: author && author.trim() ? author.trim() : 'BlogSpace Author',
      category: category || 'Technology & AI',
      tags: formattedTags.length > 0 ? formattedTags : ['BlogSpace'],
      coverImage: coverImage && coverImage.trim() ? coverImage.trim() : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      readTime: calcReadTime(content.trim()),
      likes: 0,
    };

    if (isDbConnected()) {
      const newPost = await Post.create(postPayload);
      console.log(`✅ [MongoDB Atlas] Created Post: "${newPost.title}" (_id: ${newPost._id})`);
      return res.status(201).json({
        success: true,
        message: 'Blog post created and saved to MongoDB Atlas',
        data: newPost,
      });
    }

    // In-memory fallback when MongoDB is not connected
    const newPost = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...postPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryPosts.unshift(newPost);
    console.log(`ℹ️ [Local Memory Fallback] Created Post: "${newPost.title}" (_id: ${newPost._id})`);

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully (Local Fallback - configure MONGODB_URI in .env to save to Atlas)',
      data: newPost,
    });
  } catch (error) {
    console.error('Error in createPost:', error.message);
    return res.status(400).json({
      success: false,
      message: 'Failed to create blog post: ' + error.message,
      error: error.message,
    });
  }
};

// @desc    Update existing blog post
// @route   PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, category, tags, coverImage } = req.body;

    let updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) {
      updateData.content = content.trim();
      updateData.excerpt = calcExcerpt(content.trim());
      updateData.readTime = calcReadTime(content.trim());
    }
    if (author !== undefined) updateData.author = author.trim();
    if (category !== undefined) updateData.category = category;
    if (coverImage !== undefined) updateData.coverImage = coverImage.trim();

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        updateData.tags = tags;
      } else if (typeof tags === 'string') {
        updateData.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Post ID format' });
      }
      const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updatedPost) {
        return res.status(404).json({ success: false, message: `Post with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, message: 'Blog post updated successfully', data: updatedPost });
    }

    // In-memory fallback
    const idx = memoryPosts.findIndex((p) => String(p._id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Post with ID ${id} not found` });
    }
    memoryPosts[idx] = {
      ...memoryPosts[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return res.status(200).json({ success: true, message: 'Blog post updated successfully', data: memoryPosts[idx] });
  } catch (error) {
    console.error('Error in updatePost:', error.message);
    return res.status(400).json({
      success: false,
      message: 'Failed to update blog post: ' + error.message,
      error: error.message,
    });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Post ID format' });
      }
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        return res.status(404).json({ success: false, message: `Post with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, message: 'Blog post deleted successfully', data: { id: post._id, title: post.title } });
    }

    // In-memory fallback
    const idx = memoryPosts.findIndex((p) => String(p._id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: `Post with ID ${id} not found` });
    }
    const removed = memoryPosts.splice(idx, 1)[0];
    return res.status(200).json({ success: true, message: 'Blog post deleted successfully', data: { id: removed._id, title: removed.title } });
  } catch (error) {
    console.error('Error in deletePost:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog post: ' + error.message,
      error: error.message,
    });
  }
};

// @desc    Like a blog post
// @route   PATCH /api/posts/:id/like
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Post ID format' });
      }
      const post = await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
      if (!post) {
        return res.status(404).json({ success: false, message: `Post with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, data: { id: post._id, likes: post.likes } });
    }

    // In-memory fallback
    const post = memoryPosts.find((p) => String(p._id) === String(id));
    if (!post) {
      return res.status(404).json({ success: false, message: `Post with ID ${id} not found` });
    }
    post.likes = (post.likes || 0) + 1;
    return res.status(200).json({ success: true, data: { id: post._id, likes: post.likes } });
  } catch (error) {
    console.error('Error in likePost:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to like blog post: ' + error.message,
      error: error.message,
    });
  }
};

// @desc    Seed database with sample posts
// @route   POST /api/posts/seed
exports.seedPosts = async (req, res) => {
  try {
    if (isDbConnected()) {
      const count = await Post.countDocuments();
      if (count > 0 && !req.query.force) {
        return res.status(200).json({
          success: true,
          message: `Database already contains ${count} posts.`,
        });
      }
      if (req.query.force) {
        await Post.deleteMany({});
      }
      const seedData = initialSeedPosts.map(({ _id, ...rest }) => rest);
      const created = await Post.insertMany(seedData);
      return res.status(201).json({
        success: true,
        message: `Successfully seeded ${created.length} blog posts into MongoDB Atlas!`,
        data: created,
      });
    }

    // In-memory fallback
    memoryPosts = [...initialSeedPosts];
    return res.status(201).json({
      success: true,
      message: `Successfully loaded ${memoryPosts.length} sample stories!`,
      data: memoryPosts,
    });
  } catch (error) {
    console.error('Error in seedPosts:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed posts: ' + error.message,
      error: error.message,
    });
  }
};
