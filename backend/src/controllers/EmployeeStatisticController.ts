import { Request, Response } from 'express';
import { EmployeeStatistic } from '../entities/EmployeeStatistic';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { calculateStatistics } from '../statCalc';

export default class EmployeeStatisticsController {
  repo: Repository<EmployeeStatistic>;

  constructor(repo: Repository<EmployeeStatistic>) {
    this.repo = repo;
  }

  async getEmployeeStatistics(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    const findOptions: any = {};

    if (startDate && endDate) {
      findOptions.where = {
        day: Between(startDate as string, endDate as string)
      };
    } else if (startDate) {
      return res.status(400).json({ message: 'Must supply an end date' });
    } else if (endDate) {
      findOptions.where = {
        day: LessThanOrEqual(endDate as string)
      };
    }

    try {
      const employeeStatistics = await this.repo.find(findOptions);
      res.json(employeeStatistics);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching employee statistics', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }

  async getEmployeeStatisticsByEmployee(req: Request, res: Response) {
    const { startDate, endDate } = req.query;
    const employeeId = req.params.employeeId;

    const findOptions: any = {
      where: { employeeId: parseInt(employeeId) }
    };

    if (startDate && endDate) {
      findOptions.where.day = Between(startDate as string, endDate as string);
    } else if (startDate) {
      return res.status(400).json({ message: 'Must supply an end date' });
    } else if (endDate) {
      findOptions.where.day = LessThanOrEqual(endDate as string);
    }

    try {
      const employeeStatistics = await this.repo.find(findOptions);
      res.json(employeeStatistics);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching employee statistics', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }

  async updateEmployeeStatistics(req: Request, res: Response) {
    try {
      calculateStatistics();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error calculating statistics', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
