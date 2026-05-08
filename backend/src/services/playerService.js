const prisma = require('../db');

async function listPlayers({ game, priceMin, priceMax, onlineOnly, cursor, limit = 20 }) {
  const where = {};
  if (game) where.games = { contains: game };
  if (priceMin !== undefined) where.price = { ...where.price, gte: priceMin };
  if (priceMax !== undefined) where.price = { ...where.price, lte: priceMax };
  if (onlineOnly) where.isOnline = true;

  const players = await prisma.player.findMany({
    where,
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: [{ isOnline: 'desc' }, { rating: 'desc' }],
  });

  const hasMore = players.length > limit;
  if (hasMore) players.pop();

  return {
    players: players.map(formatPlayer),
    nextCursor: hasMore ? players[players.length - 1].id : null,
  };
}

async function getPlayerById(id) {
  const player = await prisma.player.findUnique({ where: { id } });
  if (!player) return null;
  return formatPlayer(player, true);
}

async function searchPlayers({ keyword, game, limit = 10 }) {
  const where = {};
  if (keyword) where.name = { contains: keyword };
  if (game) where.games = { contains: game };

  const players = await prisma.player.findMany({
    where,
    take: limit,
    orderBy: { rating: 'desc' },
  });

  return players.map(p => formatPlayer(p));
}

async function hotPlayers({ limit = 10 }) {
  const players = await prisma.player.findMany({
    take: limit,
    orderBy: [{ ordersCount: 'desc' }, { rating: 'desc' }],
  });
  return players.map(p => formatPlayer(p));
}

async function ratePlayer(playerId, rating) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) return null;

  // 简单加权平均
  const newOrdersCount = player.ordersCount + 1;
  const newRating = ((player.rating * player.ordersCount) + rating) / newOrdersCount;

  const updated = await prisma.player.update({
    where: { id: playerId },
    data: {
      rating: Math.round(newRating * 100) / 100,
      ordersCount: newOrdersCount,
      updateTime: Date.now(),
    },
  });

  return formatPlayer(updated);
}

function formatPlayer(player, full = false) {
  const tags = player.tags ? JSON.parse(player.tags) : [];
  const games = player.games ? JSON.parse(player.games) : [];
  const base = {
    id: player.id,
    name: player.name,
    avatar: player.avatar || null,
    rank: player.rank || null,
    tags,
    price: player.price,
    isOnline: player.isOnline,
    games,
    rating: Math.round(player.rating * 100) / 100,
    ordersCount: player.ordersCount,
  };
  if (full) {
    base.description = player.description || null;
  }
  return base;
}

module.exports = { listPlayers, getPlayerById, searchPlayers, hotPlayers, ratePlayer };
