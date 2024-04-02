import { Request, Response } from 'express';
import { Location } from '../entities/Location';
import { Repository } from 'typeorm';

export default class LocationController {
  repo: Repository<Location>;

  constructor(repo: Repository<Location>) {
    this.repo = repo;
  }

  async getLocations(req: Request, res: Response) {
    try {
      const locations = await this.repo.find();
      res.json(locations);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching locations', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
