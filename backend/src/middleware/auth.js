const { verify } = require('../utils/jwt');
const { error, ErrorCodes } = require('../utils/response');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json(error(ErrorCodes.TOKEN_INVALID.code));
  }
  const token = authHeader.slice(7);
  try {
    const decoded = verify(token);
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (err) {
    return res.json(error(ErrorCodes.TOKEN_INVALID.code));
  }
}

// 可选认证：Token 存在则解析，不存在也放行
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = verify(authHeader.slice(7));
      req.userId = decoded.userId;
      req.user = decoded;
    } catch (_) {}
  }
  next();
}

module.exports = { auth, optionalAuth };
