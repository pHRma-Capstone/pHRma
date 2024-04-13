import { Request, Response } from 'express';
import { Consult, Status } from '../entities/Consult';
import { Repository } from 'typeorm';
import ConsultsController from '../controllers/ConsultController';
import { Employee } from '../entities/Employee';
import { Location } from '../entities/Location';
import { ConsultType } from '../entities/ConsultType';

//Describes the Test Suite
describe('ConsultController', () => {
    let mockRepo: Repository<Consult>;   //fake repo for testing
    let consultsController: ConsultsController;

    //runs before each test case, create new clean repo and controller
    beforeEach(() => {
        mockRepo = {} as Repository<Consult>;
        consultsController = new ConsultsController(mockRepo);
    });

    //Test getConsults 
    describe('getConsults', () => {
        it('should return Consults when repository returns data', async () => {

            const mockEmployees: Employee = new Employee();
            const mockLocation: Location = new Location();
            const mockConsoltType: ConsultType = new ConsultType();
            const mockdate: Date = new Date();

            //testing entries for Consults
            const mockConsults: Consult[] = [
                {id: 5, employee: mockEmployees, asstEmployeeId: mockEmployees, reportedToId: mockEmployees, location: mockLocation, consultType: mockConsoltType, consultDate: mockdate, status: Status.Not_Completed, medications: 2, interventions: 1, duration: null, isAdmitOrdersPlaced: true, isInterventionMissing:false, isInterventionNotTaking: true, isInterventionIncorrectDose: false,isInterventionIncorrectFrequency: false, isInterventionIncorrectRoute:false, isInterventionAllergiesUpdated: true, isInterventionVaccinationDocumented:true, isRequest:true, isInterventionIncorrectMedication: false},
                
            ];
            //create a mock function that acts as .find returning our mockConsults
            mockRepo.find = jest.fn().mockResolvedValue(mockConsults);

            const mockReq = {} as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await consultsController.getConsults(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockConsults);
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

            await consultsController.getConsults(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error fetching consults', error: 'Database error' });
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

            await consultsController.getConsults(mockReq, mockRes);


            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "An unknown error occurred" });
        });
    });
});
