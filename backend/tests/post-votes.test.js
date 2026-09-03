const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Post = require('../models/Post');

test('post vote totals are derived from one vote record per user', () => {
  const post = new Post({
    title: 'Voting test',
    content: 'A post used to verify vote totals.',
    author: new mongoose.Types.ObjectId(),
    votes: [
      { user: new mongoose.Types.ObjectId(), type: 'up' },
      { user: new mongoose.Types.ObjectId(), type: 'up' },
      { user: new mongoose.Types.ObjectId(), type: 'down' },
    ],
  });

  assert.equal(post.upvotes, 2);
  assert.equal(post.downvotes, 1);
});

test('serialized posts expose totals without exposing voter IDs', () => {
  const post = new Post({
    title: 'Private voters',
    content: 'Voter identities should not be public.',
    author: new mongoose.Types.ObjectId(),
    votes: [{ user: new mongoose.Types.ObjectId(), type: 'up' }],
  });

  const serialized = post.toJSON();
  assert.equal(serialized.upvotes, 1);
  assert.equal(serialized.downvotes, 0);
  assert.equal('votes' in serialized, false);
});
