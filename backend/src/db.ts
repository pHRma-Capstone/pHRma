import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Employee } from './entities/Employee';
import dotenv from 'dotenv';

dotenv.config();

const db = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [Employee],
  subscribers: [],
  migrations: []
});

export default db;
