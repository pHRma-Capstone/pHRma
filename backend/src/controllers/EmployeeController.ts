import { Request, Response } from 'express';
import { Employee } from '../entities/Employee';
import { Repository } from 'typeorm';

export default class EmployeeController {
  repo: Repository<Employee>;

  constructor(repo: Repository<Employee>) {
    this.repo = repo;
  }

  async getEmployees(req: Request, res: Response) {
    try {
      const employees = await this.repo.find();
      res.json(employees);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
