const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { auth } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/create', auth,
  [
    body('playerId').notEmpty().withMessage('陪玩师ID不能为空'),
    body('duration').isInt({ min: 1 }).withMessage('时长至少1小时'),
    body('game').notEmpty().withMessage('游戏类型不能为空'),
  ],
  validate,
  orderController.createOrder
);

router.get('/list', auth, orderController.listOrders);
router.get('/:id', auth, orderController.getOrder);

router.post('/:id/pay', auth,
  [body('payMethod').notEmpty().withMessage('支付方式不能为空')],
  validate,
  orderController.payOrder
);

router.post('/:id/cancel', auth,
  [body('reason').optional()],
  orderController.cancelOrder
);

router.post('/:id/accept', auth, orderController.acceptOrder);
router.post('/:id/reject', auth,
  [body('reason').optional()],
  orderController.rejectOrder
);

router.post('/:id/complete', auth, orderController.completeOrder);

module.exports = router;
