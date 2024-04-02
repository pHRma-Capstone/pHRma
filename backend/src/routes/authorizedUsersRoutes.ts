import { Router } from 'express';
import db from '../db';
import AuthorizedUserController from '../controllers/AuthorizedUserController';
import { AuthorizedUser } from '../entities/AuthorizedUser';

const repository = db.getRepository(AuthorizedUser);
const controller = new AuthorizedUserController(repository);
const router = Router();

router.get('/authorized-users', controller.getAuthorizedUsers.bind(controller));

export default router;
