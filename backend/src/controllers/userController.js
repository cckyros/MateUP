const userService = require('../services/userService');
const { success, error, ErrorCodes } = require('../utils/response');

async function register(req, res, next) {
  try {
    const { phone, password, username } = req.body;
    if (!phone || !password || !username) {
      return res.json(error(ErrorCodes.PARAM_ERROR.code));
    }
    const result = await userService.register({ phone, password, username });
    res.json(success(result));
  } catch (err) {
    if (err.code === 'P2002') {
      return res.json(error(ErrorCodes.USER_EXISTS.code));
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.json(error(ErrorCodes.PARAM_ERROR.code));
    }
    const result = await userService.login({ phone, password });
    if (!result) {
      return res.json(error(ErrorCodes.PASSWORD_ERROR.code));
    }
    res.json(success(result));
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.userId);
    if (!user) return res.json(error(ErrorCodes.USER_NOT_FOUND.code));
    res.json(success(user));
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { username, avatar } = req.body;
    const user = await userService.updateProfile(req.userId, { username, avatar });
    if (!user) return res.json(error(ErrorCodes.USER_NOT_FOUND.code));
    res.json(success(user));
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getProfile, updateProfile };
