import { Request, Response } from 'express';
import { ConsultTypes } from '../entities/ConsultTypes';
import { Repository } from 'typeorm';

export default class ConsultTypesController {
  repo: Repository<ConsultTypes>;

  constructor(repo: Repository<ConsultTypes>) {
    this.repo = repo;
  }

  async getConsultTypes(req: Request, res: Response) {
    try {
      const consultTypes = await this.repo.find();
      res.json(consultTypes);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching consults types', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
