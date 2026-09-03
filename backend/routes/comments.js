const express = require('express');
const { createComment, getComments, voteComment } = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.post('/', protect, createComment);
router.get('/', optionalAuth, getComments);
router.post('/:commentId/vote', protect, voteComment);

module.exports = router;
