const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route   POST api/users/
// @desc    create new user
// @access  Private
router.post('/', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password length must be at least 6').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (! errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password } = req.body;

  try {
    // check if user exists
    let user = await User.findOne({ email });

    // user exists, cannot register
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // get user gravatar
    const avatar = gravatar.url(email, {
      size: '200',
      rating: 'pg',
      default: 'mm',
    })

    user = new User({ name, email, avatar, password });

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600 * 24 * 30 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;