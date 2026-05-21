const express = require('express');
const authRouter = require('./auth');
const postsRouter = require('./posts');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/posts', postsRouter);

module.exports = router;
