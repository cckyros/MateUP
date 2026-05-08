const { validationResult } = require('express-validator');
const { error, ErrorCodes } = require('../utils/response');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msgs = errors.array().map(e => e.msg).join(', ');
    return res.json(error(ErrorCodes.VALIDATION_ERROR.code, msgs));
  }
  next();
}

module.exports = { validate };
