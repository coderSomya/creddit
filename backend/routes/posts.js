const express = require('express');
const { createPost, getPosts, getPostById, votePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const commentRouter = require('./comments');

const router = express.Router();

router.use('/:id/comments', commentRouter);

router.get('/', getPosts);
router.post('/', protect, createPost);
router.get('/:id', getPostById);
router.post('/:id/vote', protect, votePost);

module.exports = router;
