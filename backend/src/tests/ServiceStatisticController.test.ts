import { Request, Response } from 'express';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import ServiceStatisticController from '../controllers/ServiceStatisticController';
import { ServiceStatistic } from '../entities/ServiceStatistic';

describe('ServiceStatisticController', () => {
  let mockRepo: Repository<ServiceStatistic>;
  let controller: ServiceStatisticController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRepo = {
      find: jest.fn(),
    } as unknown as Repository<ServiceStatistic>;
    controller = new ServiceStatisticController(mockRepo);
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getServiceStatistics', () => {
    it('should return service statistics between startDate and endDate', async () => {
      const startDate = '2024-04-01';
      const endDate = '2024-04-30';
      mockRequest.query = { startDate, endDate };
      const expectedFindOptions = {
        where: {
          day: Between(startDate, endDate),
        },
      };

      await controller.getServiceStatistics(mockRequest as Request, mockResponse as Response);

      expect(mockRepo.find).toHaveBeenCalledWith(expectedFindOptions);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 400 error if startDate is provided without endDate', async () => {
      const startDate = '2024-04-01';
      mockRequest.query = { startDate };

      await controller.getServiceStatistics(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Must supply an end date' });
    });

    it('should return service statistics with day less than or equal to endDate', async () => {
      const endDate = '2024-04-30';
      mockRequest.query = { endDate };
      const expectedFindOptions = {
        where: {
          day: LessThanOrEqual(endDate),
        },
      };

      await controller.getServiceStatistics(mockRequest as Request, mockResponse as Response);

      expect(mockRepo.find).toHaveBeenCalledWith(expectedFindOptions);
      expect(mockResponse.json).toHaveBeenCalled();
    });


  });
});