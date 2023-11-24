import express from 'express';
import dotenv from 'dotenv/config';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import {
  NotFound,
  errorHandler,
} from './middlewares/errorHandlerMiddleware.js';
import { authRouter } from './routes/auth.router.js';
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form data
app.use(cookieParser());
app.use('/api/users', authRouter);
app.get('/', (req, res) => {
  res.send('hello saadoon');
});
app.use(NotFound);
app.use(errorHandler);
// const start = async () => {
//   // console.log('server is listenting now on port ' + port);

// }
// start()

const _db = async () => {
  await connectDB();
};
_db();
const server = app.listen(port, () => {
  console.log('server is listenting now on port ' + port);
});
export { server };
