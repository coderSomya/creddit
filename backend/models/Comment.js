const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['up', 'down'],
    required: true,
  },
}, { _id: false });

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: [true, 'Comment body is required'],
    trim: true,
    maxlength: [10000, 'Comment cannot exceed 10000 characters'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  votes: { type: [voteSchema], default: [] },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.virtual('upvotes').get(function () {
  return this.votes.filter((vote) => vote.type === 'up').length;
});

commentSchema.virtual('downvotes').get(function () {
  return this.votes.filter((vote) => vote.type === 'down').length;
});

commentSchema.set('toJSON', {
  virtuals: true,
  transform: (_document, result) => {
    delete result.votes;
    return result;
  },
});
commentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Comment', commentSchema);
