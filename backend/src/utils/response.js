// 统一响应格式和错误码

const ErrorCodes = {
  SUCCESS: { code: 0, message: 'success' },
  PARAM_ERROR: { code: 1001, message: '参数错误' },
  VALIDATION_ERROR: { code: 1002, message: '参数校验失败' },
  USER_NOT_FOUND: { code: 2001, message: '用户不存在' },
  PASSWORD_ERROR: { code: 2002, message: '密码错误' },
  USER_EXISTS: { code: 2003, message: '用户已存在' },
  PLAYER_NOT_FOUND: { code: 3001, message: '陪玩师不存在' },
  ORDER_NOT_FOUND: { code: 4001, message: '订单不存在' },
  ORDER_STATUS_ERROR: { code: 4002, message: '订单状态不允许此操作' },
  BALANCE_INSUFFICIENT: { code: 4003, message: '余额不足' },
  NO_PERMISSION: { code: 5001, message: '无权限' },
  TOKEN_INVALID: { code: 5002, message: 'Token无效或过期' },
  SERVER_ERROR: { code: 9001, message: '服务器内部错误' },
};

function success(data) {
  return {
    code: 0,
    message: 'success',
    data: replacer(data),
  };
}

function error(code, message) {
  return {
    code,
    message: message || ErrorCodes[code]?.message || '未知错误',
    data: null,
  };
}

function fromCode(code, message) {
  const ec = ErrorCodes[code] || ErrorCodes.SERVER_ERROR;
  return {
    code: ec.code,
    message: message || ec.message,
    data: null,
  };
}

// 解决 BigInt 无法 JSON 序列化问题
function replacer(k, v) {
  if (typeof v === 'bigint') return v.toString();
  return v;
}

module.exports = {
  ErrorCodes,
  success,
  error,
  fromCode,
  replacer,
};
