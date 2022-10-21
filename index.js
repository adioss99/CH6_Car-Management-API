import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routes/routes.js';

dotenv.config();
const app = express();
const port = 5000

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

// // Generate env key 
// import crypto from 'crypto';
// const key = crypto.randomBytes(32).toString('hex');
// console.log('ACCESS_TOKEN_SECRET =', key);
// console.log('REFRESH_TOKEN_SECRET = ', key);
