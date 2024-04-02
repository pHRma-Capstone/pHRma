import { Router } from 'express';
import db from '../db';
import ConsultTypesController from '../controllers/ConsultTypeController';
import { ConsultType } from '../entities/ConsultType';

const repository = db.getRepository(ConsultType);
const controller = new ConsultTypesController(repository);
const router = Router();

router.get('/consult-types', controller.getConsultTypes.bind(controller));

export default router;
