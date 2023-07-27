const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Post = require('../../models/Post');

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', auth,
  check('text', 'Post content is required').notEmpty(),
  async(req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password -email');

      const newPost = Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })

      await newPost.save();

      res.json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async(req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

// @route   GET api/posts/:post_id
// @desc    Get all posts
// @access  Private
router.get('/:post_id', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (! post) {
      res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send('Server Error');
  }
})

// @route   DELETE api/posts/:post_id
// @desc    Get all posts
// @access  Private
router.delete('/:post_id', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (! post) {
      res.status(404).json({ msg: 'Post not found' });
    }

    // check if user is post owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.deleteOne();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send('Server Error');
  }
})

// @route   PUT api/posts/like:post_id
// @desc    Like a post
// @access  Private
router.put('/like/:post_id', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (! post) {
      res.status(404).json({ msg: 'Post not found' });
    }

    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send('Server Error');
  }
})

// @route   PUT api/posts/unlike:post_id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:post_id', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (! post) {
      res.status(404).json({ msg: 'Post not found' });
    }

    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post not liked yet' });
    }

    post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send('Server Error');
  }
})

// @route   PUT api/posts/comment/:post_id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:post_id', auth,
  check('text', 'Comment content is required').notEmpty(),
  async(req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password -email');
      const post = await Post.findById(req.params.post_id);

      if (! post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err);

      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }

      res.status(500).send('Server Error');
    }
})

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete post comment
// @access  Private
router.delete('/comment/:post_id/:comment_id', auth,
  async(req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.post_id);

      if (! post) {
        res.status(404).json({ msg: 'Post not found' });
      }

      const comment = post.comments.find(comment => comment.id === req.params.comment_id);

      if (! comment) {
        return res.status(404).json({ msg: 'Comment not found' });
      }

      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      post.comments = post.comments.filter(comment => comment.id !== req.params.comment_id);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err);

      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }

      res.status(500).send('Server Error');
    }
})

module.exports = router;
