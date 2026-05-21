const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

const createComment = asyncHandler(async (req, res) => {
  const { body } = req.body;

  if (!body) throw new AppError('Comment body is required', 400);

  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const comment = await Comment.create({ body, author: req.user._id, post: post._id });
  await post.updateOne({ $push: { comments: comment._id } });
  await comment.populate('author', 'username');

  res.status(201).json(comment);
});

const getComments = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const comments = await Comment.find({ post: req.params.id })
    .sort({ createdAt: -1 })
    .populate('author', 'username');

  res.json(comments);
});

module.exports = { createComment, getComments };
