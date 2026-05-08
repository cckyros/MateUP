const { error, ErrorCodes } = require('../utils/response');
const logger = require('./logger');

function errorHandler(err, req, res, next) {
  logger.error(`[Error] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.code === 'P2002') {
    return res.json(error(ErrorCodes.USER_EXISTS.code, '数据已存在'));
  }

  return res.json(error(ErrorCodes.SERVER_ERROR.code, err.message));
}

module.exports = errorHandler;
