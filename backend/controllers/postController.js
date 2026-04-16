const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const post = await Post.create({
      title,
      content,
      author: req.user._id,
    });

    await post.populate('author', 'username');

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getPosts = async (req, res) => {
  const { sort = 'newest' } = req.query;

  const sortOption =
    sort === 'popular'
      ? { upvotes: -1, createdAt: -1 }
      : { createdAt: -1 };

  try {
    const posts = await Post.find()
      .sort(sortOption)
      .populate('author', 'username');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createPost, getPosts, getPostById };
