const prisma = require('../db');
const { ErrorCodes } = require('../utils/response');

const STATUS = {
  CREATED: 'CREATED',
  WAIT_ACCEPT: 'WAIT_ACCEPT',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const VALID_TRANSITIONS = {
  [STATUS.CREATED]: [STATUS.WAIT_ACCEPT, STATUS.CANCELLED],
  [STATUS.WAIT_ACCEPT]: [STATUS.IN_PROGRESS, STATUS.CANCELLED],
  [STATUS.IN_PROGRESS]: [STATUS.COMPLETED, STATUS.CANCELLED],
  [STATUS.COMPLETED]: [],
  [STATUS.CANCELLED]: [],
};

async function createOrder(userId, { playerId, duration, game, remark }) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) return { error: ErrorCodes.PLAYER_NOT_FOUND };

  const price = player.price * duration;
  const now = Date.now();

  const order = await prisma.order.create({
    data: {
      userId,
      playerId,
      game,
      duration,
      price,
      status: STATUS.CREATED,
      remark,
      createTime: now,
    },
    include: { player: { select: { id: true, name: true, avatar: true } } },
  });

  return { order: formatOrder(order) };
}

async function payOrder(userId, orderId, { payMethod }) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { error: ErrorCodes.ORDER_NOT_FOUND };
  if (order.userId !== userId) return { error: ErrorCodes.NO_PERMISSION };
  if (!VALID_TRANSITIONS[order.status].includes(STATUS.WAIT_ACCEPT)) {
    return { error: ErrorCodes.ORDER_STATUS_ERROR };
  }

  // mock 支付，直接成功
  const now = Date.now();
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: STATUS.WAIT_ACCEPT, payTime: now },
    include: { player: { select: { id: true, name: true, avatar: true } } },
  });

  return { order: formatOrder(updated) };
}

async function cancelOrder(userId, orderId, { reason }) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { error: ErrorCodes.ORDER_NOT_FOUND };
  if (order.userId !== userId) return { error: ErrorCodes.NO_PERMISSION };
  if (!VALID_TRANSITIONS[order.status].includes(STATUS.CANCELLED)) {
    return { error: ErrorCodes.ORDER_STATUS_ERROR };
  }

  const now = Date.now();
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: STATUS.CANCELLED, cancelTime: now, cancelReason: reason },
    include: { player: { select: { id: true, name: true, avatar: true } } },
  });

  return { order: formatOrder(updated) };
}

async function acceptOrder(playerUserId, orderId) {
  // 通过 playerUserId 找到 player 记录
  const player = await prisma.player.findUnique({ where: { userId: playerUserId } });
  if (!player) return { error: ErrorCodes.PLAYER_NOT_FOUND };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { error: ErrorCodes.ORDER_NOT_FOUND };
  if (order.playerId !== player.id) return { error: ErrorCodes.NO_PERMISSION };
  if (order.status !== STATUS.WAIT_ACCEPT) return { error: ErrorCodes.ORDER_STATUS_ERROR };

  const now = Date.now();
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: STATUS.IN_PROGRESS, acceptTime: now },
    include: { player: { select: { id: true, name: true, avatar: true } } },
  });

  return { order: formatOrder(updated) };
}

async function rejectOrder(playerUserId, orderId, { reason }) {
  const player = await prisma.player.findUnique({ where: { userId: playerUserId } });
  if (!player) return { error: ErrorCodes.PLAYER_NOT_FOUND };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { error: ErrorCodes.ORDER_NOT_FOUND };
  if (order.playerId !== player.id) return { error: ErrorCodes.NO_PERMISSION };
  if (order.status !== STATUS.WAIT_ACCEPT) return { error: ErrorCodes.ORDER_STATUS_ERROR };

  const now = Date.now();
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: STATUS.CANCELLED, cancelTime: now, cancelReason: reason },
    include: { player: { select: { id: true, name: true, avatar: true } } },
  });

  return { order: formatOrder(updated) };
}

async function completeOrder(orderId) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { error: ErrorCodes.ORDER_NOT_FOUND };
  if (order.status !== STATUS.IN_PROGRESS) return { error: ErrorCodes.ORDER_STATUS_ERROR };

  const now = Date.now();
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: STATUS.COMPLETED, completeTime: now },
    include: { player: { select: { id: true, name: true, avatar: true } } },
  });

  return { order: formatOrder(updated) };
}

async function getOrderById(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { player: { select: { id: true, name: true, avatar: true } } },
  });
  if (!order) return null;
  return formatOrder(order);
}

async function listOrders(userId, { status, page = 1, limit = 20 }) {
  const where = { userId };
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { player: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createTime: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map(formatOrder),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

function formatOrder(order) {
  return {
    id: order.id,
    playerId: order.player.id,
    playerName: order.player.name,
    playerAvatar: order.player.avatar || null,
    game: order.game,
    duration: order.duration,
    price: order.price,
    status: order.status,
    remark: order.remark || null,
    createTime: order.createTime,
    payTime: order.payTime || null,
    acceptTime: order.acceptTime || null,
    completeTime: order.completeTime || null,
    cancelTime: order.cancelTime || null,
    cancelReason: order.cancelReason || null,
  };
}

module.exports = {
  createOrder, payOrder, cancelOrder, acceptOrder, rejectOrder,
  completeOrder, getOrderById, listOrders, STATUS,
};
