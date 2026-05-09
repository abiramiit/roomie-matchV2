const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validate, register
);
router.post('/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate, login
);
router.get('/me', protect, getMe);

module.exports = router;
