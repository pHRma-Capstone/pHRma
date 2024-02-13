import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.get('/api/', (req: Request, res: Response) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
