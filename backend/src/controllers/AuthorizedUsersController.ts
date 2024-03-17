import { Request, Response } from 'express';
import { AuthorizedUsers } from '../entities/AuthorizedUsers';
import { Repository } from 'typeorm';

export default class AuthorizedUserController {
  repo: Repository<AuthorizedUsers>;

  constructor(repo: Repository<AuthorizedUsers>) {
    this.repo = repo;
  }

  async getAuthorizedUsers(req: Request, res: Response) {
    try {
      const authorized_users = await this.repo.find();
      res.json(authorized_users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching authorized users', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}