const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const { serializeComment } = require('../controllers/commentController');

test('comment vote totals are derived from per-user vote records', () => {
  const comment = new Comment({
    body: 'A comment with votes.',
    author: new mongoose.Types.ObjectId(),
    post: new mongoose.Types.ObjectId(),
    votes: [
      { user: new mongoose.Types.ObjectId(), type: 'up' },
      { user: new mongoose.Types.ObjectId(), type: 'up' },
      { user: new mongoose.Types.ObjectId(), type: 'down' },
    ],
  });

  assert.equal(comment.upvotes, 2);
  assert.equal(comment.downvotes, 1);
});

test('serialized comments expose the current vote without exposing voter IDs', () => {
  const user = new mongoose.Types.ObjectId();
  const comment = new Comment({
    body: 'Private voters.',
    author: new mongoose.Types.ObjectId(),
    post: new mongoose.Types.ObjectId(),
    votes: [{ user, type: 'up' }],
  });

  const serialized = serializeComment(comment, user);
  assert.equal(serialized.upvotes, 1);
  assert.equal(serialized.downvotes, 0);
  assert.equal(serialized.userVote, 'up');
  assert.equal('votes' in serialized, false);
});
