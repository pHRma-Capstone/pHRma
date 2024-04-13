import { Request, Response } from 'express';
import { AuthorizedUser } from '../entities/AuthorizedUser';
import { Repository } from 'typeorm';
import AuthorizedUserController from '../controllers/AuthorizedUserController';
import { Employee } from '../entities/Employee';

//Describes the Test Suite
describe('AuthorizedUserController', () => {
    let mockRepo: Repository<AuthorizedUser>;   //fake repo for testing
    let authorizedUserController: AuthorizedUserController;

    //runs before each test case, create new clean repo and controller
    beforeEach(() => {
        mockRepo = {} as Repository<AuthorizedUser>;
        authorizedUserController = new AuthorizedUserController(mockRepo);
    });

    //Test getAuthorizedUsers 
    describe('getAuthorizedUsers', () => {
        it('should return AuthorizedUsers when repository returns data', async () => {

            const mockEmployees: Employee[] = [
                { id: 1, firstName: 'John', lastName: 'Doe', isMedHistoryTechnician: true, isMedHistoryIntern: false, isPharmacist: false, shiftSchedule: null },
                { id: 2, firstName: 'Jane', lastName: 'Smith', isMedHistoryTechnician: false, isMedHistoryIntern: false, isPharmacist: true, shiftSchedule: null },
            ];

            //testing entries for AuthorizedUsers
            const mockAuthorizedUsers: AuthorizedUser[] = [
                {employee_id: 1, employee: mockEmployees[1], username: "john", hashedPassword: "hashed", isAdminPrivileges: false, isSupervisorPrivileges: true}, {employee_id: 1, employee: mockEmployees[2], username: "jane", hashedPassword: "hashed2", isAdminPrivileges: true, isSupervisorPrivileges: false},
            ];
            //create a mock function that acts as .find returning our mockAuthorizedUsers
            mockRepo.find = jest.fn().mockResolvedValue(mockAuthorizedUsers);

            const mockReq = {} as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await authorizedUserController.getAuthorizedUsers(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockAuthorizedUsers);
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

            await authorizedUserController.getAuthorizedUsers(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error fetching authorized users', error: 'Database error' });
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

            await authorizedUserController.getAuthorizedUsers(mockReq, mockRes);


            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "An unknown error occurred" });
        });
    });
});
