import { Router } from 'express';
import db from '../db';
import EmployeeController from '../controllers/EmployeeController';
import { Employee } from '../entities/Employee';

const repository = db.getRepository(Employee);
const controller = new EmployeeController(repository);
const router = Router();

router.get('/employees', controller.getEmployees.bind(controller));

export default router;
