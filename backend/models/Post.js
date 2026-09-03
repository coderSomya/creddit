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

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  votes: { type: [voteSchema], default: [] },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.virtual('upvotes').get(function () {
  return this.votes.filter((vote) => vote.type === 'up').length;
});

postSchema.virtual('downvotes').get(function () {
  return this.votes.filter((vote) => vote.type === 'down').length;
});

postSchema.set('toJSON', {
  virtuals: true,
  transform: (_document, result) => {
    delete result.votes;
    return result;
  },
});
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
