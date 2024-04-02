import { Router } from 'express';
import db from '../db';
import ConsultTypesController from '../controllers/ConsultTypesController';
import { ConsultTypes } from '../entities/ConsultTypes';

const repository = db.getRepository(ConsultTypes);
const controller = new ConsultTypesController(repository);
const router = Router();

router.get('/consults_types', controller.getConsultTypes.bind(controller));

export default router;
