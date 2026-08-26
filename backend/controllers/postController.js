const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { findSimilar } = require('../utils/similarity');

const incrementPostVote = async (postId, field) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    { $inc: { [field]: 1 } },
    { new: true }
  ).populate('author', 'username');

  if (!post) throw new AppError('Post not found', 404);
  return post;
};

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new AppError('Title and content are required', 400);
  }

  const post = await Post.create({ title, content, author: req.user._id });
  await post.populate('author', 'username');

  res.status(201).json(post);
});

const getPosts = asyncHandler(async (req, res) => {
  const { sort = 'newest' } = req.query;

  const sortOption = sort === 'popular'
    ? { upvotes: -1, createdAt: -1 }
    : { createdAt: -1 };

  const posts = await Post.find().sort(sortOption).populate('author', 'username');
  res.json(posts);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  if (!post) throw new AppError('Post not found', 404);
  res.json(post);
});

const votePost = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (type !== 'up' && type !== 'down') {
    throw new AppError('Vote type must be "up" or "down"', 400);
  }

  const field = type === 'up' ? 'upvotes' : 'downvotes';
  const post = await incrementPostVote(req.params.id, field);
  res.json(post);
});

const likePost = asyncHandler(async (req, res) => {
  const post = await incrementPostVote(req.params.id, 'upvotes');
  res.json(post);
});

const dislikePost = asyncHandler(async (req, res) => {
  const post = await incrementPostVote(req.params.id, 'downvotes');
  res.json(post);
});

// ── Controller ────────────────────────────────────────────────────────────────

const getSimilarPosts = asyncHandler(async (req, res) => {
  const target = await Post.findById(req.params.id);
  if (!target) throw new AppError('Post not found', 404);

  const allPosts = await Post.find().populate('author', 'username');
  const others = allPosts.filter((p) => String(p._id) !== String(target._id));

  res.json(findSimilar(target, others));
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  votePost,
  likePost,
  dislikePost,
  getSimilarPosts,
};
