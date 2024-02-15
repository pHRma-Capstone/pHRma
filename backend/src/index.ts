import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employeeRoutes';
import db from './db';

const start = async () => {
  try {
    // setup
    const app: Express = express();
    app.use(cors());

    await db.initialize();
    console.log('Database connection initialized');

    // register routes
    app.use('/api', employeeRoutes);

    // more setup
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error('Failed to start start server:', error);
  }
};

start();
