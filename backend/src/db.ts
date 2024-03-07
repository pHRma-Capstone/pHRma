import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Employee } from './entities/Employee';
import { ServiceStatistic } from './entities/ServiceStatistic';

dotenv.config();

const db = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [Employee, ServiceStatistic],
  subscribers: [],
  migrations: []
});

export default db;
