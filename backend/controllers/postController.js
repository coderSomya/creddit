const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { findSimilar } = require('../utils/similarity');

const serializePost = (post, userId) => {
  const result = post.toObject({ virtuals: true });
  const vote = userId
    ? result.votes.find((item) => String(item.user) === String(userId))
    : null;

  result.userVote = vote?.type || null;
  delete result.votes;
  return result;
};

const setPostVote = async (postId, userId, type) => {
  const sameVote = await Post.updateOne(
    { _id: postId, votes: { $elemMatch: { user: userId, type } } },
    { $pull: { votes: { user: userId } } }
  );

  if (!sameVote.matchedCount) {
    const changedVote = await Post.updateOne(
      { _id: postId, 'votes.user': userId },
      { $set: { 'votes.$.type': type } }
    );

    if (!changedVote.matchedCount) {
      await Post.updateOne(
        { _id: postId, 'votes.user': { $ne: userId } },
        { $push: { votes: { user: userId, type } } }
      );
    }
  }

  const post = await Post.findById(postId).populate('author', 'username');
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

  res.status(201).json(serializePost(post, req.user._id));
});

const getPosts = asyncHandler(async (req, res) => {
  const { sort = 'newest' } = req.query;

  const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'username');
  const response = posts.map((post) => serializePost(post, req.user?._id));

  if (sort === 'popular') {
    response.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
      || new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(response);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  if (!post) throw new AppError('Post not found', 404);
  res.json(serializePost(post, req.user?._id));
});

const votePost = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (type !== 'up' && type !== 'down') {
    throw new AppError('Vote type must be "up" or "down"', 400);
  }

  const post = await setPostVote(req.params.id, req.user._id, type);
  res.json(serializePost(post, req.user._id));
});

const likePost = asyncHandler(async (req, res) => {
  const post = await setPostVote(req.params.id, req.user._id, 'up');
  res.json(serializePost(post, req.user._id));
});

const dislikePost = asyncHandler(async (req, res) => {
  const post = await setPostVote(req.params.id, req.user._id, 'down');
  res.json(serializePost(post, req.user._id));
});

// ── Controller ────────────────────────────────────────────────────────────────

const getSimilarPosts = asyncHandler(async (req, res) => {
  const target = await Post.findById(req.params.id);
  if (!target) throw new AppError('Post not found', 404);

  const allPosts = await Post.find().populate('author', 'username');
  const others = allPosts.filter((p) => String(p._id) !== String(target._id));

  res.json(findSimilar(target, others).map((post) => serializePost(post, req.user?._id)));
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
