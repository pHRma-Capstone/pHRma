import express, { Express, Request } from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes';
import serviceStatisticRoutes from './routes/serviceStatisticRoutes';
import fileUploadRoutes from './routes/fileUploadRoutes';
import employeeStatatisticRoutes from './routes/employeeStatisticRoutes';
import db from './db';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/');
  },

  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, new Date().toJSON().slice(0, -5) + '.csv'); // you can set the file name here
  }
});

const upload = multer({ storage });

const start = async () => {
  try {
    // setup
    const app: Express = express();
    app.use(cors());

    await db.initialize();
    console.log('Database connection initialized');

    // register routes
    app.use('/api', employeeRoutes);
    app.use('/api', serviceStatisticRoutes);
    app.use('/api', fileUploadRoutes);
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
