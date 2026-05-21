const express = require('express');
const { createComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.post('/', protect, createComment);
router.get('/', getComments);

module.exports = router;
