import { Router } from 'express';
import db from '../db';
import AuthorizedUserController from '../controllers/AuthorizedUsersController';
import { AuthorizedUsers } from '../entities/AuthorizedUsers';

const repository = db.getRepository(AuthorizedUsers);
const controller = new AuthorizedUserController(repository);
const router = Router();

router.get('/authorized_users', controller.getAuthorizedUsers.bind(controller));

export default router;
