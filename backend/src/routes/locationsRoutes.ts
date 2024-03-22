import { Router } from 'express';
import db from '../db';
import LocationController from '../controllers/LocationsController';
import { Location } from '../entities/Locations';

const repository = db.getRepository(Location);
const controller = new LocationController(repository);
const router = Router();

router.get('/location', controller.getLocations.bind(controller));

export default router;