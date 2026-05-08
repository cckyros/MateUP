const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { auth } = require('../middleware/auth');
const playerController = require('../controllers/playerController');

const router = express.Router();

router.get('/', playerController.listPlayers);
router.get('/search', playerController.searchPlayers);
router.get('/hot', playerController.hotPlayers);
router.get('/:id', playerController.getPlayer);
router.post('/:id/rate', auth,
  [body('rating').isInt({ min: 1, max: 5 }).withMessage('评分1-5')],
  validate,
  playerController.ratePlayer
);

module.exports = router;
