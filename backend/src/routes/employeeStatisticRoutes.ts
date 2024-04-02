import { Router } from 'express';
import db from '../db';
import EmployeeStatisticsController from '../controllers/EmployeeStatisticController';
import { EmployeeStatistic } from '../entities/EmployeeStatistic';

const repository = db.getRepository(EmployeeStatistic);
const controller = new EmployeeStatisticsController(repository);
const router = Router();

router.get('/employee-statistics', controller.getEmployeeStatistics.bind(controller));
router.get('/employee-statistics/:employeeId', controller.getEmployeeStatisticsByEmployee.bind(controller));

export default router;
