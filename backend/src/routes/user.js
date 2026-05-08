const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { auth } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register',
  [
    body('phone').isMobilePhone('zh-CN').withMessage('手机号格式错误'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6位'),
    body('username').notEmpty().withMessage('用户名不能为空'),
  ],
  validate,
  userController.register
);

router.post('/login',
  [
    body('phone').notEmpty().withMessage('手机号不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
  ],
  validate,
  userController.login
);

router.get('/profile', auth, userController.getProfile);

router.put('/profile', auth,
  [
    body('username').optional().notEmpty().withMessage('用户名不能为空'),
    body('avatar').optional().isURL().withMessage('头像必须是有效URL'),
  ],
  validate,
  userController.updateProfile
);

module.exports = router;
