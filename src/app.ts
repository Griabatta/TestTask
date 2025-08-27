import * as dotenv from 'dotenv';

dotenv.config()

import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import userRoutes from './routes/User.routes';
import { errorHandler } from "./middleware/error.middleware";
import { AppDataSource } from "./config/data-source";




const app = express() as Application;
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch(error => console.log('Database connection failed:', error));


export default app;