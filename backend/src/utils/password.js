const bcrypt = require('bcryptjs');
const config = require('../config');

async function hash(plainPassword) {
  return bcrypt.hash(plainPassword, config.bcrypt.saltRounds);
}

async function compare(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { hash, compare };
