const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

const serializeComment = (comment, userId) => {
  const result = comment.toObject({ virtuals: true });
  const vote = userId
    ? result.votes.find((item) => String(item.user) === String(userId))
    : null;

  result.userVote = vote?.type || null;
  delete result.votes;
  return result;
};

const createComment = asyncHandler(async (req, res) => {
  const { body } = req.body;

  if (!body) throw new AppError('Comment body is required', 400);

  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const comment = await Comment.create({ body, author: req.user._id, post: post._id });
  await post.updateOne({ $push: { comments: comment._id } });
  await comment.populate('author', 'username');

  res.status(201).json(serializeComment(comment, req.user._id));
});

const getComments = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const comments = await Comment.find({ post: req.params.id })
    .sort({ createdAt: -1 })
    .populate('author', 'username');

  res.json(comments.map((comment) => serializeComment(comment, req.user?._id)));
});

const voteComment = asyncHandler(async (req, res) => {
  const { type } = req.body;

  if (type !== 'up' && type !== 'down') {
    throw new AppError('Vote type must be "up" or "down"', 400);
  }

  const comment = await Comment.findOne({ _id: req.params.commentId, post: req.params.id });
  if (!comment) throw new AppError('Comment not found', 404);

  const existingVoteIndex = comment.votes.findIndex(
    (vote) => String(vote.user) === String(req.user._id)
  );
  const existingVote = comment.votes[existingVoteIndex];

  if (existingVote?.type === type) {
    comment.votes.splice(existingVoteIndex, 1);
  } else if (existingVote) {
    existingVote.type = type;
  } else {
    comment.votes.push({ user: req.user._id, type });
  }

  await comment.save();
  await comment.populate('author', 'username');
  res.json(serializeComment(comment, req.user._id));
});

module.exports = { createComment, getComments, voteComment, serializeComment };
