const prisma = require('../db');
const { hash, compare } = require('../utils/password');
const { sign } = require('../utils/jwt');

async function register({ phone, password, username }) {
  const now = Date.now();
  const hashedPassword = await hash(password);

  const user = await prisma.user.create({
    data: {
      phone,
      password: hashedPassword,
      username,
      createTime: now,
      updateTime: now,
    },
  });

  const token = sign({ userId: user.id, phone: user.phone });
  return { token, user: formatUser(user) };
}

async function login({ phone, password }) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return null;

  const valid = await compare(password, user.password);
  if (!valid) return null;

  const token = sign({ userId: user.id, phone: user.phone });
  return { token, user: formatUser(user) };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return formatUser(user);
}

async function updateProfile(userId, { username, avatar }) {
  const now = Date.now();
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(username !== undefined && { username }),
      ...(avatar !== undefined && { avatar }),
      updateTime: now,
    },
  });
  return formatUser(user);
}

function formatUser(user) {
  return {
    id: user.id,
    phone: user.phone,
    username: user.username,
    avatar: user.avatar || null,
    createTime: user.createTime,
  };
}

module.exports = { register, login, getProfile, updateProfile };
