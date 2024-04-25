import { Router } from 'express';
import db from '../db';
import LocationController from '../controllers/LocationController';
import { Location } from '../entities/Location';

const repository = db.getRepository(Location);
const controller = new LocationController(repository);
const router = Router();

router.get('/location', controller.getLocations.bind(controller));

export default router;
