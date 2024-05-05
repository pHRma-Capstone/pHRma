import express, { Express, Request } from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes';
import serviceStatisticRoutes from './routes/serviceStatisticRoutes';
import fileUploadRoutes from './routes/fileUploadRoutes';
import employeeStatatisticRoutes from './routes/employeeStatisticRoutes';
import db from './db';
import multer from 'multer';

const start = async () => {
  try {
    // setup
    const app: Express = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const storage = multer.memoryStorage();

    const upload = multer({
      storage
    });

    await db.initialize();
    console.log('Database connection initialized');

    // register routes
    app.use('/api', employeeRoutes);
    app.use('/api', serviceStatisticRoutes);
    app.use('/api', upload.single("UploadedFile"), fileUploadRoutes);
    app.use('/api', employeeStatatisticRoutes);

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
