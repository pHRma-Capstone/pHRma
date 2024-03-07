import { Router } from 'express';
import db from '../db';
import ServiceStatisticController from '../controllers/ServiceStatisticController';
import { ServiceStatistic } from '../entities/ServiceStatistic';

const repository = db.getRepository(ServiceStatistic);
const controller = new ServiceStatisticController(repository);
const router = Router();

router.get('/service-statistics', controller.getServiceStatistics.bind(controller));

export default router;
