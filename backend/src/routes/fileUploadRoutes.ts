import { Router } from 'express';
import FileUploadController from '../controllers/FileUploadController';

const router = Router();

const controller = new FileUploadController();

router.post('/upload_files', controller.FileUpload.bind(controller));

export default router;
