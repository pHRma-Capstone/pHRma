import { Request, Response } from 'express';
import { EmployeeStatistics } from '../entities/EmployeeStatistics';
import { Repository } from 'typeorm';

export default class EmployeeStatisticsController {
  repo: Repository<EmployeeStatistics>;

  constructor(repo: Repository<EmployeeStatistics>) {
    this.repo = repo;
  }

  async getEmployeeStatistics(req: Request, res: Response) {
    try {
      const employeeStatistics = await this.repo.find();
      res.json(employeeStatistics);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching employee statistics', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}