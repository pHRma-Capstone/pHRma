import { Request, Response } from 'express';
import { ServiceStatistic } from '../entities/ServiceStatistic';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { calculateStatistics } from '../statCalc';

export default class ServiceStatisticController {
  repo: Repository<ServiceStatistic>;

  constructor(repo: Repository<ServiceStatistic>) {
    this.repo = repo;
  }

  async getServiceStatistics(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    let findOptions: any = {};

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
      const serviceStatistics = await this.repo.find(findOptions);
      return res.json(serviceStatistics);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: 'Error fetching service statistics', error: error.message });
      } else {
        return res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }

  async updateServiceStatistics(req: Request, res: Response) {
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
