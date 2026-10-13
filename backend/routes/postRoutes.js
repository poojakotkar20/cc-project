const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  seedPosts,
} = require('../controllers/postController');

// Routes for /api/posts
router.route('/')
  .get(getPosts)
  .post(createPost);

router.route('/seed')
  .post(seedPosts);

router.route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

router.route('/:id/like')
  .patch(likePost);

module.exports = router;
