import { Request, Response } from 'express';
import { Consult } from '../entities/Consult';
import { Repository } from 'typeorm';

export default class ConsultsController {
  repo: Repository<Consult>;

  constructor(repo: Repository<Consult>) {
    this.repo = repo;
  }

  async getConsults(req: Request, res: Response) {
    try {
      const consults = await this.repo.find();
      res.json(consults);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching consults', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
