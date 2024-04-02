import { Router } from 'express';
import db from '../db';
import ConsultsController from '../controllers/ConsultController';
import { Consult } from '../entities/Consult';

const repository = db.getRepository(Consult);
const controller = new ConsultsController(repository);
const router = Router();

router.get('/consults', controller.getConsults.bind(controller));

export default router;
