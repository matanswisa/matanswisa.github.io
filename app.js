import express from 'express';
import path from 'path';
import logger from 'morgan';
import { normalizePort } from './utils/port.js';
import TradesRoute from './routes/TradesRoute.js';
import bodyParser from 'body-parser';
import connectDB from './utils/db.js';

connectDB();

const app = express();

app.use(bodyParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", TradesRoute);





const port = normalizePort(process.env.PORT || '8000');

app.listen(port, () => {
    console.log(`Server is running and listening in port ${port}`);
})
