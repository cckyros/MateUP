const orderService = require('../services/orderService');
const { success, error, ErrorCodes } = require('../utils/response');

async function createOrder(req, res, next) {
  try {
    const { playerId, duration, game, remark } = req.body;
    if (!playerId || !duration || !game) {
      return res.json(error(ErrorCodes.PARAM_ERROR.code));
    }
    const result = await orderService.createOrder(req.userId, { playerId, duration, game, remark });
    if (result.error) return res.json(error(result.error.code));
    res.json(success(result.order));
  } catch (err) {
    next(err);
  }
}

async function payOrder(req, res, next) {
  try {
    const { payMethod } = req.body;
    const result = await orderService.payOrder(req.userId, req.params.id, { payMethod });
    if (result.error) return res.json(error(result.error.code));
    res.json(success(result.order));
  } catch (err) {
    next(err);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const { reason } = req.body;
    const result = await orderService.cancelOrder(req.userId, req.params.id, { reason });
    if (result.error) return res.json(error(result.error.code));
    res.json(success(result.order));
  } catch (err) {
    next(err);
  }
}

async function acceptOrder(req, res, next) {
  try {
    const result = await orderService.acceptOrder(req.userId, req.params.id);
    if (result.error) return res.json(error(result.error.code));
    res.json(success(result.order));
  } catch (err) {
    next(err);
  }
}

async function rejectOrder(req, res, next) {
  try {
    const { reason } = req.body;
    const result = await orderService.rejectOrder(req.userId, req.params.id, { reason });
    if (result.error) return res.json(error(result.error.code));
    res.json(success(result.order));
  } catch (err) {
    next(err);
  }
}

async function completeOrder(req, res, next) {
  try {
    const result = await orderService.completeOrder(req.params.id);
    if (result.error) return res.json(error(result.error.code));
    res.json(success(result.order));
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.json(error(ErrorCodes.ORDER_NOT_FOUND.code));
    res.json(success(order));
  } catch (err) {
    next(err);
  }
}

async function listOrders(req, res, next) {
  try {
    const { status, page, limit } = req.query;
    const result = await orderService.listOrders(req.userId, {
      status,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    res.json(success(result));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder, payOrder, cancelOrder, acceptOrder, rejectOrder,
  completeOrder, getOrder, listOrders,
};
