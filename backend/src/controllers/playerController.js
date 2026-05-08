const playerService = require('../services/playerService');
const { success, error, ErrorCodes } = require('../utils/response');

async function listPlayers(req, res, next) {
  try {
    const { game, price_min, price_max, online_only, cursor, limit } = req.query;
    const result = await playerService.listPlayers({
      game,
      priceMin: price_min ? Number(price_min) : undefined,
      priceMax: price_max ? Number(price_max) : undefined,
      onlineOnly: online_only === 'true',
      cursor,
      limit: limit ? Number(limit) : 20,
    });
    res.json(success(result));
  } catch (err) {
    next(err);
  }
}

async function getPlayer(req, res, next) {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    if (!player) return res.json(error(ErrorCodes.PLAYER_NOT_FOUND.code));
    res.json(success(player));
  } catch (err) {
    next(err);
  }
}

async function searchPlayers(req, res, next) {
  try {
    const { keyword, game, limit } = req.query;
    const players = await playerService.searchPlayers({
      keyword,
      game,
      limit: limit ? Number(limit) : 10,
    });
    res.json(success({ players }));
  } catch (err) {
    next(err);
  }
}

async function hotPlayers(req, res, next) {
  try {
    const { limit } = req.query;
    const players = await playerService.hotPlayers({ limit: limit ? Number(limit) : 10 });
    res.json(success({ players, total: players.length }));
  } catch (err) {
    next(err);
  }
}

async function ratePlayer(req, res, next) {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.json(error(ErrorCodes.PARAM_ERROR.code));
    }
    const player = await playerService.ratePlayer(req.params.id, Number(rating));
    if (!player) return res.json(error(ErrorCodes.PLAYER_NOT_FOUND.code));
    res.json(success(player));
  } catch (err) {
    next(err);
  }
}

module.exports = { listPlayers, getPlayer, searchPlayers, hotPlayers, ratePlayer };
