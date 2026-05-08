const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/user');
const playerRoutes = require('./routes/player');
const orderRoutes = require('./routes/order');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// 覆盖 res.json 以支持 BigInt 序列化
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    const serialized = JSON.stringify(body, (k, v) => {
      if (typeof v === 'bigint') return v.toString();
      return v;
    });
    return res.type('json').send(serialized);
  };
  next();
});

// 路由
app.use('/api', userRoutes);        // POST /api/login, /api/register
app.use('/api/user', userRoutes);  // GET/PUT /api/user/profile
app.use('/api/players', playerRoutes);
app.use('/api/order', orderRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ code: 404, message: 'Not Found', data: null });
});

// 错误处理
app.use(errorHandler);

module.exports = app;
