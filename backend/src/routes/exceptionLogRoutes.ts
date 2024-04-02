import { Router } from 'express';
import db from '../db';
import ExceptionLogController from '../controllers/ExceptionLogController';
import { ExceptionLog } from '../entities/ExceptionLog';

const repository = db.getRepository(ExceptionLog);
const controller = new ExceptionLogController(repository);
const router = Router();

router.get('/exception_log', controller.getExceptionLog.bind(controller));

export default router;
