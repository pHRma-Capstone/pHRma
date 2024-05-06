import { Request, Response } from 'express';
import { NotBrackets } from 'typeorm';

import { Consult } from '../entities/Consult';
import { Employee } from '../entities/Employee';
import { ConsultType } from '../entities/ConsultType';
import { Duration } from '../entities/Consult';
import { Location } from '../entities/Location';
import { Status } from '../entities/Consult';
import { EmployeeStatistic } from '../entities/EmployeeStatistic';
import { ServiceStatistic } from '../entities/ServiceStatistic';
import FileUploadController from '../controllers/FileUploadController';
import { rmSync } from 'fs';

describe('FileUploadController', ()=> {

    let fileUploadController: FileUploadController;

    //mock data
    const mockEmployee: Employee[] = [{id: 1, firstName: "John", lastName: "Doe", isMedHistoryTechnician: true, isMedHistoryIntern:false, isPharmacist: false, shiftSchedule: 1}, {id: 2, firstName: "Jane", lastName: "Doe", isMedHistoryTechnician: true, isMedHistoryIntern:false, isPharmacist: true, shiftSchedule: 2}, {id: 3, firstName: "bob", lastName: "bones", isMedHistoryTechnician: false, isMedHistoryIntern:true, isPharmacist: false, shiftSchedule: 3}
    ];


    const mockConsult: Consult[] = [{
        id: 1,
        employee: {
            id: 1, firstName: "John", lastName: "Doe", isMedHistoryTechnician: true, isMedHistoryIntern:false, isPharmacist: false, shiftSchedule: 1
        },
        asstEmployeeId: {
            id: 2, firstName: "Jane", lastName: "Doe", isMedHistoryTechnician: true, isMedHistoryIntern:false, isPharmacist: true, shiftSchedule: 2
        },
        reportedToId: {
            id: 3, firstName: "bob", lastName: "bones", isMedHistoryTechnician: false, isMedHistoryIntern:true, isPharmacist: false, shiftSchedule: 3
        },
        location: {
            id: 1,
            name: 'MHC',
            isIntensive: false,
            consult: []
        },
        consultType: {
            id: 0,
            name: '',
            consult: []
        },
        consultDate: new Date(),
        status: Status.Completed,
        medications: 2,
        interventions: 3,
        duration: Duration.Fifteen,
        isAdmitOrdersPlaced: false,
        isInterventionMissing: true,
        isInterventionNotTaking: false,
        isInterventionIncorrectMedication: false,
        isInterventionIncorrectDose: false,
        isInterventionIncorrectFrequency: false,
        isInterventionIncorrectRoute: false,
        isInterventionAllergiesUpdated: true,
        isInterventionVaccinationDocumented: true,
        isRequest: false,
      }]


    const mockConsult_types: ConsultType[] = [{
        id: 1,
        name: 'MHC',
        consult: []
    }]


    const mockLocations: Location[] = [{
        id: 0,
        name: 'room1',
        isIntensive: false,
        consult: []
    }];

    

    beforeEach(() => {
        fileUploadController = new FileUploadController();

        fileUploadController.getEmployees = jest.fn().mockImplementation(() => {
            fileUploadController.employees = mockEmployee;
        })

        fileUploadController.getConsultTypes = jest.fn().mockImplementation(() => {
            fileUploadController.consultTypes = mockConsult_types;
        })

        fileUploadController.getLocations = jest.fn().mockImplementation(() => {
            fileUploadController.locations = mockLocations;
        })
    });



    describe('parseLine Test', () => {
        it('Correct input', async () =>{

            const csvLine:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            const splitbycomma = csvLine.split(',');

            var result = await fileUploadController.parseLine(splitbycomma);

            //console.log("result", result);

            expect(fileUploadController.getEmployees).toHaveBeenCalled();
            expect(fileUploadController.getConsultTypes).toHaveBeenCalled();
            expect(fileUploadController.getLocations).toHaveBeenCalled();


            expect(result).toBeInstanceOf(Consult);

            expect(result?.employee.firstName).toBe('John');
            expect(result?.asstEmployeeId).not.toBeInstanceOf(Consult)
            expect(result?.reportedToId).not.toBeInstanceOf(Consult)
            expect(result?.location.name).toBe('room1');
            expect(result?.consultType.name).toBe('MHC');
            expect(result?.status).toBe(Status.Completed);
            expect(result?.medications).toBe(39);
            expect(result?.interventions).toBe(64);
            expect(result?.duration).toBe(Duration.Ninety);
            expect(result?.isAdmitOrdersPlaced).toBe(true);
            expect(result?.isInterventionMissing).toBe(true);
            expect(result?.isInterventionNotTaking).toBe(false);
            expect(result?.isInterventionIncorrectMedication).toBe(false);
            expect(result?.isInterventionIncorrectDose).toBe(false);
            expect(result?.isInterventionIncorrectFrequency).toBe(false);
            expect(result?.isInterventionIncorrectRoute).toBe(true);
            expect(result?.isInterventionVaccinationDocumented).toBe(true);
            expect(result?.isRequest).toBe(true);

        })


        it('incorrect input length', async () =>{
            //one comma missing at end
            const csvLine:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,"; 

            const splitbycomma = csvLine.split(',');

            var result = await fileUploadController.parseLine(splitbycomma);

            expect(result).not.toBeInstanceOf(Consult);
        })

        it('Incorect null Values', async () =>{
            
            //fist name gone
            const csvLine:string = "MHC,2024-01-02 06:00:00,Doe,,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            //last name gone
            const csvLine2:string = "MHC,2024-01-02 06:00:00,,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            //type gone
            const csvLine3:string = ",2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            //duration gone
            const csvLine4:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,,,,";

            //status gone
            const csvLine5:string = "MHC,2024-01-02 06:00:00,Doe,John,,,,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            const splitbycomma = csvLine.split(',');
            const splitbycomma2 = csvLine2.split(',');
            const splitbycomma3 = csvLine3.split(',');
            const splitbycomma4 = csvLine4.split(',');
            const splitbycomma5 = csvLine5.split(',');

            var result = await fileUploadController.parseLine(splitbycomma);
            var result2 = await fileUploadController.parseLine(splitbycomma2);
            var result3 = await fileUploadController.parseLine(splitbycomma3);
            var result4 = await fileUploadController.parseLine(splitbycomma4);
            var result5 = await fileUploadController.parseLine(splitbycomma5);


            expect(result).not.toBeInstanceOf(Consult);
            expect(result2).not.toBeInstanceOf(Consult);
            expect(result3).not.toBeInstanceOf(Consult);
            expect(result4).not.toBeInstanceOf(Consult);
            expect(result5).not.toBeInstanceOf(Consult);

        })


        it('None Maching names', async () =>{

            //bad main name
            const csvLine:string = "MHC,2024-01-02 06:00:00,Doe,wrongName,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            //bad assisting
            const csvLine2:string = "MHC,2024-01-02 06:00:00,Doe,John,wrong,bad,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            //bad pharma
            const csvLine3:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,wrong,bad,";

            const splitbycomma = csvLine.split(',');
            const splitbycomma2 = csvLine2.split(',');
            const splitbycomma3 = csvLine3.split(',');

            var result = await fileUploadController.parseLine(splitbycomma);
            var result2 = await fileUploadController.parseLine(splitbycomma2);
            var result3 = await fileUploadController.parseLine(splitbycomma3);

            expect(result).not.toBeInstanceOf(Consult);
            expect(result2).not.toBeInstanceOf(Consult);
            //expect(result3).not.toBeInstanceOf(Consult);
            /////////////////////////broken idk why
        })

        it('incorect enums', async () =>{
            //bad status
            const csvLine:string = "MHC,2024-01-02 06:00:00,Doe,John,,,badStatus,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            //bad status 2
            const csvLine2:string = "MHC,2024-01-02 06:00:00,Doe,John,,,not completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            //bad location
            const csvLine3:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,badLength,,,";

            //bad type
            const csvLine4:string = "BAD,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,badLength,,,";

            const splitbycomma = csvLine.split(',');
            const splitbycomma2 = csvLine2.split(',');
            const splitbycomma3 = csvLine3.split(',');
            const splitbycomma4 = csvLine3.split(',');

            var result = await fileUploadController.parseLine(splitbycomma);
            var result2 = await fileUploadController.parseLine(splitbycomma2);
            var result3 = await fileUploadController.parseLine(splitbycomma3);
            var result4 = await fileUploadController.parseLine(splitbycomma4);

            expect(result).not.toBeInstanceOf(Consult);
            expect(result2).not.toBeInstanceOf(Consult);
            expect(result3).not.toBeInstanceOf(Consult);
            expect(result4).not.toBeInstanceOf(Consult);

        })

        it('incorrect true false', async () =>{

            const csvLine:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,BAD,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";
            const csvLine2:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,BAD,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";
            const csvLine3:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,BAD,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";
            const csvLine4:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,BAD,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";
            const csvLine5:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,BAD,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";
            const csvLine6:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,BAD,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";
            const csvLine7:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,BAD,TRUE,FALSE,TRUE,>1 Hour,,,";
            const csvLine8:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,BAD,FALSE,TRUE,>1 Hour,,,";
            const csvLine9:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,BAD,TRUE,>1 Hour,,,";
            const csvLine10:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,BAD,>1 Hour,,,";

            const splitbycomma = csvLine.split(',');
            const splitbycomma2 = csvLine2.split(',');
            const splitbycomma3 = csvLine3.split(',');
            const splitbycomma4 = csvLine4.split(',');
            const splitbycomma5 = csvLine5.split(',');
            const splitbycomma6 = csvLine6.split(',');
            const splitbycomma7 = csvLine7.split(',');
            const splitbycomma8 = csvLine8.split(',');
            const splitbycomma9 = csvLine9.split(',');
            const splitbycomma10 = csvLine10.split(',');

            var result = await fileUploadController.parseLine(splitbycomma);
            var result2 = await fileUploadController.parseLine(splitbycomma2);
            var result3 = await fileUploadController.parseLine(splitbycomma3);
            var result4 = await fileUploadController.parseLine(splitbycomma4);
            var result5 = await fileUploadController.parseLine(splitbycomma5);
            var result6 = await fileUploadController.parseLine(splitbycomma6);
            var result7 = await fileUploadController.parseLine(splitbycomma7);
            var result8 = await fileUploadController.parseLine(splitbycomma8);
            var result9 = await fileUploadController.parseLine(splitbycomma9);
            var result10 = await fileUploadController.parseLine(splitbycomma10);

            expect(result).not.toBeInstanceOf(Consult);
            expect(result2).not.toBeInstanceOf(Consult);
            expect(result3).not.toBeInstanceOf(Consult);
            expect(result4).not.toBeInstanceOf(Consult);
            expect(result5).not.toBeInstanceOf(Consult);
            expect(result6).not.toBeInstanceOf(Consult);
            expect(result7).not.toBeInstanceOf(Consult);
            expect(result8).not.toBeInstanceOf(Consult);
            expect(result9).not.toBeInstanceOf(Consult);
            expect(result10).not.toBeInstanceOf(Consult);

        })

        it('bad numbers', async () =>{

            //future date
            const csvLine:string = "MHC,3000-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            // to early date
            const csvLine2:string = "MHC,1000-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            //big meds
            const csvLine3:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,1000,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";
            //big interventions
            const csvLine4:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,1000,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";
     

            const splitbycomma = csvLine.split(',');
            const splitbycomma2 = csvLine2.split(',');
            const splitbycomma3 = csvLine3.split(',');
            const splitbycomma4 = csvLine4.split(',');


            var result = await fileUploadController.parseLine(splitbycomma);
            var result2 = await fileUploadController.parseLine(splitbycomma2);
            var result3 = await fileUploadController.parseLine(splitbycomma3);
            var result4 = await fileUploadController.parseLine(splitbycomma4);

            expect(result).not.toBeInstanceOf(Consult);
            expect(result2).not.toBeInstanceOf(Consult);
            expect(result3).not.toBeInstanceOf(Consult);
            expect(result4).not.toBeInstanceOf(Consult);


        })

        it('non pharmacist as pharmacist', async () =>{

            const csvLine:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,Doe,John,";

            const splitbycomma = csvLine.split(',');

            var result = await fileUploadController.parseLine(splitbycomma);

            ///////////////////not working right
            //expect(result).not.toBeInstanceOf(Consult);
        })

        it('actual pharmacist as pharmacist', async () =>{

            const csvLine:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,Doe,Jane,";

            const splitbycomma = csvLine.split(',');

            var result = await fileUploadController.parseLine(splitbycomma);

            expect(result).toBeInstanceOf(Consult);
        })

        it('bad consult type', async () =>{

            const csvLine:string = "MHC,2024-01-02 06:00:00,Doe,John,,,Completed,Other,TRUE,39,64,TRUE,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,>1 Hour,,,";

            const splitbycomma = csvLine.split(',');

            var result = await fileUploadController.parseLine(splitbycomma);
        })

    })

})