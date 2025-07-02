import express from 'express';
import mainRouter from './server/routes/main.js';
import { PORT, PUBLIC_DIR } from './server/config/constants.js';

const app = express();

// 정적자원
app.use('/static', express.static(PUBLIC_DIR));

// 메인
app.use('/', mainRouter);

// 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});