import { Router, Request, Response } from 'express';
import multer from 'multer';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, new Date().toJSON().slice(0, -5) + '.csv');
  }
});

const upload = multer({ storage });

router.post('/file-upload', upload.single('UploadedFile'), (req: Request, res: Response) => {
  res.send('File uploaded');
});

export default router;
