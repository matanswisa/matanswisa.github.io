import express from 'express';
import path from 'path';
import logger from 'morgan';
import { normalizePort } from './utils/port.js';
import TradesRoute from './routes/TradesRoute.js';
import bodyParser from 'body-parser';
import connectDB from './utils/db.js';
import cors from 'cors';
import userRoute from './routes/UserRoute.js';
import adminSeeder from './utils/adminSeeder.js';
import authRouter from './routes/auth.js';
import AccountRoute from './routes/AccountsRoute.js'
import SendMailRoute from './routes/sendMail.js'

connectDB();
adminSeeder();

const app = express();

app.use(cors());
app.use(bodyParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", TradesRoute);
app.use("/api/auth", userRoute);
app.use("/api/auth", authRouter);
app.use("/api/auth", SendMailRoute);
app.use("/api", AccountRoute);


const port = normalizePort(process.env.PORT || '8000');

app.listen(port, () => {
    console.log(`Server is running and listening in port ${port}`);
})
