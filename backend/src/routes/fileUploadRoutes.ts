import { Router } from 'express';
import multer from 'multer';
import FileUploadController from "../controllers/FileUploadController";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

const controller = new FileUploadController();

router.post('/upload_files', controller.FileUpload.bind(controller));

export default router;
