import { Request, Response } from 'express';
import { Location } from '../entities/Location';
import { Repository } from 'typeorm';
import LocationController from '../controllers/LocationController';
import { Consult } from '../entities/Consult';

//Describes the Test Suite
describe('LocationController', () => {
    let mockRepo: Repository<Location>;   //fake repo for testing
    let locationController: LocationController;

    //runs before each test case, create new clean repo and controller
    beforeEach(() => {
        mockRepo = {} as Repository<Location>;
        locationController = new LocationController(mockRepo);
    });

    //Test getLocations 
    describe('getLocations', () => {
        it('should return Locations when repository returns data', async () => {

            var mockConsults: Consult[] = [];

            //testing entries for location
            const mockLocation: Location[] = [
                {id: 1, name: "room2", isIntensive: false, consult: mockConsults},{id: 2, name: "room3", isIntensive: false, consult: mockConsults},{id: 3, name: "room4", isIntensive: false, consult: mockConsults}
            ];
            //create a mock function that acts as .find returning our mockEmployees
            mockRepo.find = jest.fn().mockResolvedValue(mockLocation);

            const mockReq = {} as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await locationController.getLocations(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockLocation);
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

            await locationController.getLocations(mockReq, mockRes);

            expect(mockRepo.find).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error fetching locations', error: 'Database error' });
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

            await locationController.getLocations(mockReq, mockRes);


            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "An unknown error occurred" });
        });
    });
});
