require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const app = require('./app');
const config = require('./config');
const logger = require('./middleware/logger');
const prisma = require('./db');

const PORT = config.port;

async function main() {
  // 测试数据库连接
  try {
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error('Database connection failed:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  });
}

main().catch(err => {
  logger.error('Server startup error:', err.message);
  process.exit(1);
});
