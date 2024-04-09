import { Request, Response } from 'express';
import { ExceptionLog } from '../entities/ExceptionLog';
import { Repository } from 'typeorm';

export default class ExceptionLogController {
  repo: Repository<ExceptionLog>;

  constructor(repo: Repository<ExceptionLog>) {
    this.repo = repo;
  }

  async getExceptionLog(req: Request, res: Response) {
    try {
      const exceptionLog = await this.repo.find();
      res.json(exceptionLog);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching exception log', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
