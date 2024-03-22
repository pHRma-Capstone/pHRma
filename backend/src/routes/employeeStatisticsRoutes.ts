import { Router } from 'express';
import db from '../db';
import EmployeeStatisticsController from '../controllers/EmployeeStatisticsController';
import { EmployeeStatistics } from '../entities/EmployeeStatistics';

const repository = db.getRepository(EmployeeStatistics);
const controller = new EmployeeStatisticsController(repository);
const router = Router();

router.get('/employee_statistics', controller.getEmployeeStatistics.bind(controller));

export default router;
