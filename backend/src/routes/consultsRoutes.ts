import { Router } from 'express';
import db from '../db';
import ConsultsController from '../controllers/ConsultsController';
import { Consults } from '../entities/Consults';

const repository = db.getRepository(Consults);
const controller = new ConsultsController(repository);
const router = Router();

router.get('/consults', controller.getConsults.bind(controller));

export default router;
