import { Request, Response } from 'express';
import { ExceptionLog } from '../entities/ExceptionLog';
import { Repository } from 'typeorm';
import ExceptionLogController from '../controllers/ExceptionLogController';
import { Employee } from '../entities/Employee';


//Describes the Test Suite
describe('ExceptionLogController', () => {
    let mockRepo: Repository<ExceptionLog>;   //fake repo for testing
    let exceptionLogController: ExceptionLogController;

    //runs before each test case, create new clean repo and controller
    beforeEach(() => {
        mockRepo = {} as Repository<ExceptionLog>;
        exceptionLogController = new ExceptionLogController(mockRepo);
    });

    //Test getExceptionLogs 
    describe('getExceptionLogs', () => {
        it('should return ExceptionLogs when repository returns data', async () => {

            const mockEmployees: Employee = new Employee();
            const mockDate: Date = new Date();

            //testing entries for ExceptionLog
            const mockExceptionLog: ExceptionLog[] = [
                {id: 1, employee: mockEmployees, exceptionDate: mockDate, missedPunchIn: false, inTime: null, missedPunchLunchIn: false, lunchInTime: null, missedPunchLunchOut: false, lunchOutTime: null,missedPunchOut: false, outTime: null, isSignedEmployee: true, isSignedSupervisor: true, reason: "my bad",hoursTimeOff: 56, timeOffType: null}
            ];
            //create a mock function that acts as .find returning our mockExceptonlog
            mockRepo.find = jest.fn().mockResolvedValue(mockExceptionLog);

            const mockReq = {} as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await exceptionLogController.getExceptionLog(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockExceptionLog);
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

            await exceptionLogController.getExceptionLog(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error fetching exception log', error: 'Database error' });
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

            await exceptionLogController.getExceptionLog(mockReq, mockRes);


            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "An unknown error occurred" });
        });
    });
});
