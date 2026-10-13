const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog post title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Blog post content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [240, 'Excerpt cannot exceed 240 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      default: 'Cloud Architect',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Cloud Architecture',
          'Web Development',
          'DevOps & CI/CD',
          'Database Design',
          'System Design',
          'General Tech',
        ],
        message: '{VALUE} is not a supported category',
      },
      default: 'Cloud Architecture',
    },
    tags: {
      type: [String],
      default: ['Cloud', 'ThreeTier'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    },
    readTime: {
      type: String,
      default: '3 min read',
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate excerpt & calculate reading time if not provided
postSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    const stripped = this.content.replace(/[#*`_~]/g, '');
    this.excerpt = stripped.length > 150 ? stripped.substring(0, 147) + '...' : stripped;
  }
  if (!this.readTime && this.content) {
    const wordCount = this.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    this.readTime = `${minutes} min read`;
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
