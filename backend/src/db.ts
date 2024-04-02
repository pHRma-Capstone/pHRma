import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Employee } from './entities/Employee';
import { ServiceStatistic } from './entities/ServiceStatistic';
import { AuthorizedUser } from './entities/AuthorizedUser';
import { Consult } from './entities/Consult';
import { ConsultType } from './entities/ConsultType';
import { EmployeeStatistic } from './entities/EmployeeStatistic';
import { ExceptionLog } from './entities/ExceptionLog';
import { Location } from './entities/Location';

dotenv.config();

const db = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [Employee, ServiceStatistic, AuthorizedUser, Consult, ConsultType, EmployeeStatistic, ExceptionLog, Location],
  subscribers: [],
  migrations: []
});

export default db;
