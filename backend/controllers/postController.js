const mongoose = require('mongoose');
const Post = require('../models/Post');

// Sample initial posts for seeding
const initialSeedPosts = [
  {
    title: 'Deploying a 3-Tier Web Application: Netlify, Render, and MongoDB Atlas',
    author: 'Cloud Architect',
    category: 'Cloud Architecture',
    tags: ['Netlify', 'Render', 'MongoDB', 'CloudComputing'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    content: `Three-tier architecture is a battle-tested software design pattern that divides an application into three logical and computing tiers:

1. **Presentation Tier (Netlify)**: Serves static assets, manages user interaction, and communicates strictly over HTTPS REST calls.
2. **Application Tier (Render)**: Processes business logic, validates payloads, enforces CORS security, and interacts with persistent data stores.
3. **Database Tier (MongoDB Atlas)**: Managed distributed document store holding persistent collections with replica sets and automated backups.

By decoupling each tier into dedicated cloud platforms, development teams gain independent scalability, zero-downtime deployments, and isolated failure domains.`,
    excerpt: 'Deep dive into decoupling web applications into independent cloud providers: Netlify for UI, Render for API, and Atlas for DB.',
    readTime: '4 min read',
    likes: 42,
  },
  {
    title: 'Securing Cross-Origin Resource Sharing (CORS) in Distributed Clouds',
    author: 'Security Specialist',
    category: 'DevOps & CI/CD',
    tags: ['CORS', 'Security', 'Express', 'Render'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    content: `When your frontend is hosted on **https://your-app.netlify.app** and your backend is hosted on **https://api.onrender.com**, browsers enforce the Same-Origin Policy.

To allow legitimate API calls, your Express application must configure explicit CORS headers:
- Specify exact origins instead of wildcard '*' in production.
- Allow necessary HTTP methods: GET, POST, PUT, DELETE, PATCH, OPTIONS.
- Handle preflight OPTIONS requests gracefully.

This prevents unauthorized third-party domains from querying or modifying your backend resources.`,
    excerpt: 'Mastering CORS policies and environment variable configuration across Netlify and Render web services.',
    readTime: '3 min read',
    likes: 29,
  },
  {
    title: 'Schema Design & Indexing Best Practices on MongoDB Atlas',
    author: 'Data Engineer',
    category: 'Database Design',
    tags: ['MongoDB', 'Atlas', 'Mongoose', 'NoSQL'],
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
    content: `MongoDB Atlas offers managed cloud databases with automated sharding, point-in-time recovery, and elastic scaling.

When designing schemas with Mongoose:
- Use specific validation constraints (lengths, enums, required fields).
- Generate automatic timestamps (createdAt, updatedAt) for auditability.
- Utilize database indexes for search fields to avoid full collection scans.
- Secure connection strings in secret environment variables such as MONGODB_URI.`,
    excerpt: 'A comprehensive guide to structured NoSQL document design, connection string security, and indexing in MongoDB Atlas.',
    readTime: '5 min read',
    likes: 38,
  },
];

// @desc    Get all blog posts (with optional search and category filter)
// @route   GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

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

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Post ID format',
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
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
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      });
    }

    let formattedTags = [];
    if (Array.isArray(tags)) {
      formattedTags = tags;
    } else if (typeof tags === 'string' && tags.trim().length > 0) {
      formattedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: author && author.trim() ? author.trim() : 'Cloud Scribe',
      category: category || 'Cloud Architecture',
      tags: formattedTags.length > 0 ? formattedTags : ['Cloud'],
      coverImage: coverImage && coverImage.trim() ? coverImage.trim() : undefined,
    });

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: newPost,
    });
  } catch (error) {
    console.error('Error in createPost:', error.message);
    return res.status(400).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message,
    });
  }
};

// @desc    Update existing blog post
// @route   PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Post ID format',
      });
    }

    const { title, content, author, category, tags, coverImage } = req.body;

    let updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
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

    // Recompute excerpt and readTime if content was updated
    if (content) {
      const stripped = content.replace(/[#*`_~]/g, '');
      updateData.excerpt = stripped.length > 150 ? stripped.substring(0, 147) + '...' : stripped;
      const wordCount = content.trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(wordCount / 200));
      updateData.readTime = `${minutes} min read`;
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    console.error('Error in updatePost:', error.message);
    return res.status(400).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message,
    });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Post ID format',
      });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
      data: { id: post._id, title: post.title },
    });
  } catch (error) {
    console.error('Error in deletePost:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message,
    });
  }
};

// @desc    Like a blog post (increment likes)
// @route   PATCH /api/posts/:id/like
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Post ID format',
      });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: { id: post._id, likes: post.likes },
    });
  } catch (error) {
    console.error('Error in likePost:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to like blog post',
      error: error.message,
    });
  }
};

// @desc    Seed database with sample posts
// @route   POST /api/posts/seed
exports.seedPosts = async (req, res) => {
  try {
    const count = await Post.countDocuments();
    if (count > 0 && !req.query.force) {
      return res.status(200).json({
        success: true,
        message: `Database already contains ${count} posts. Use ?force=true to reseed.`,
      });
    }

    if (req.query.force) {
      await Post.deleteMany({});
    }

    const created = await Post.insertMany(initialSeedPosts);
    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${created.length} initial blog posts!`,
      data: created,
    });
  } catch (error) {
    console.error('Error in seedPosts:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed posts',
      error: error.message,
    });
  }
};
