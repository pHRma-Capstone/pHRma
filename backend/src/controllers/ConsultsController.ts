import { Request, Response } from 'express';
import { Consults } from '../entities/Consults';
import { Repository } from 'typeorm';

export default class ConsultsController {
  repo: Repository<Consults>;

  constructor(repo: Repository<Consults>) {
    this.repo = repo;
  }

  async getConsults(req: Request, res: Response) {
    try {
      const consults = await this.repo.find();
      res.json(consults);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}