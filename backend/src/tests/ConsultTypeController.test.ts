import { Request, Response } from 'express';
import { ConsultType } from '../entities/ConsultType';
import { Repository } from 'typeorm';
import ConsultTypesController from '../controllers/ConsultTypeController';
import { Consult } from '../entities/Consult';


//Describes the Test Suite
describe('ConsultTypesController', () => {
    let mockRepo: Repository<ConsultType>;   //fake repo for testing
    let consultTypesController: ConsultTypesController;

    //runs before each test case, create new clean repo and controller
    beforeEach(() => {
        mockRepo = {} as Repository<ConsultType>;
        consultTypesController = new ConsultTypesController(mockRepo);
    });

    //Test getAuthorizedUsers 
    describe('getConsultTypes', () => {
        it('should return ConsultTypes when repository returns data', async () => {

            const mockConsult: Consult[] = [];

            const mockConsultTypes: ConsultType[] = [
                {id: 1, name: "type1", consult: mockConsult}, {id: 2, name:"type2", consult: mockConsult},
            ];

            //create a mock function that acts as .find returning our mockAuthorizedUsers
            mockRepo.find = jest.fn().mockResolvedValue(mockConsultTypes);

            const mockReq = {} as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await consultTypesController.getConsultTypes(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockConsultTypes);
        });

        //testing error handling in repo error
        it('should handle error when repository throws an error', async () => {
            const mockError = new Error('Database error');

            //fake error return from database
            mockRepo.find = jest.fn().mockRejectedValue(mockError);

            const mockReq = {} as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await consultTypesController.getConsultTypes(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error fetching consults types', error: 'Database error' });
        });

        //test unknown error
        it('should handle unknown error', async () => {

            const NullError = null;

            //return Null from database to emulate unknown error
            mockRepo.find = jest.fn().mockRejectedValue(NullError);


            const mockReq = {} as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await consultTypesController.getConsultTypes(mockReq, mockRes);


            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "An unknown error occurred" });
        });
    });
});
