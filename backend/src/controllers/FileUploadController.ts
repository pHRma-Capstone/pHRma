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

import db from '../db';

export default class FileUploadController {

  constructor() {}

  async FileUpload(req: Request, res: Response) {
    try {

        // this checks to make sure file upload was successful and file was added to request object //

        if (req.file != null) {

            const consultsRepo = db.getRepository(Consult);
            const employeeRepo = db.getRepository(Employee);
            const locationRepo = db.getRepository(Location);
            const consultTypesRepo = db.getRepository(ConsultType);
            const serviceStatisticRepo = db.getRepository(ServiceStatistic);
            const employeeStatisticRepo = db.getRepository(EmployeeStatistic);
          
            // get all employee, location, and consult types records for later comparison //
          
            const employees: Employee[] = await employeeRepo.createQueryBuilder('employee').select().getMany();
            const locations: Location[] = await locationRepo.createQueryBuilder('locations').select().getMany();
            const consultTypes: ConsultType[] = await consultTypesRepo.createQueryBuilder('consult_types').select().getMany();
          
            // create empty array to add validated consult records to later save to database //
          
            const consults: Consult[] = [];
          
            // get max id number from consult table to later increment to add to new consult records //
          
            const max_existing_id: number = (await consultsRepo.createQueryBuilder('consults').select('MAX(consults.id) AS max').getRawOne()).max;
            let id = max_existing_id;
          
            // define bounds for allowable date values for later comparison //
          
            const earlyDate = new Date('January 1, 2010');
            const curDate = new Date();
            curDate.setDate(curDate.getDate() + 1);

            // multer memory storage passes file contents as buffer object //
            // need to decode buffer to UTF-8 string, //
            // then split decoded buffer by newline character to get each row of .csv file //
            // this will produce an array of strings representing each row of .csv file //

            const file = req.file.buffer;
            const splitByNewLine = file.toString('utf-8').split('\n');
            
            const numInputFileEntries = splitByNewLine.length;

            // for each row in .csv file, we then split it by ',' (comma) to get an array of strings //
            // this returns an array of strings containing each field in the selected row in .csv file // 

            for (let counter = 0; counter < numInputFileEntries; counter++) {

                const inputEntryFieldArray = splitByNewLine[counter].split(',')

                if (inputEntryFieldArray.length == 24) {

                    const consultType = inputEntryFieldArray[0];
                    const timestamp = inputEntryFieldArray[1];
                    const lastName = inputEntryFieldArray[2];
                    const firstName = inputEntryFieldArray[3];
                    const assistLastName = inputEntryFieldArray[4];                    
                    const assistFirstName = inputEntryFieldArray[5];
                    const status = inputEntryFieldArray[6];
                    const location = inputEntryFieldArray[7];
                    const admit = inputEntryFieldArray[8];
                    const medications = inputEntryFieldArray[9];
                    const interventions = inputEntryFieldArray[10];
                    const request = inputEntryFieldArray[11];
                    const missingMedications = inputEntryFieldArray[12];
                    const notTaking = inputEntryFieldArray[13];
                    const incorrectMedication = inputEntryFieldArray[14];
                    const incorrectDose = inputEntryFieldArray[15];
                    const incorrectFrequency = inputEntryFieldArray[16];
                    const incorrectRoute = inputEntryFieldArray[17];
                    const allergy = inputEntryFieldArray[18];
                    const vaccination = inputEntryFieldArray[19];
                    const duration = inputEntryFieldArray[20];
                    // skip index [21] //
                    // this is the comments field which could potentially contain protected health information //
                    // since it is just a free text field entered by user with no defined values //
                    const pharmacistLastName = inputEntryFieldArray[22];
                    const pharmacistFirstName = inputEntryFieldArray[23];
                    
                    // check non-nullable values //

                    // defining breakCheck boolean for program control/efficiency as foreach function does not have simple break functionality //

                    let breakCheck = false;

                    if (
                    firstName == null ||
                    lastName == null ||
                    consultType == null ||
                    duration == null ||
                    status == null
                    ) {
                    breakCheck = true;
                    }

                    // instantiate new consult object //

                    const consultRecord = new Consult();

                    // define a bunch of booleans so record is only inserted if all field validity checks succeed //

                    let employeeCheck = false;
                    let asstEmployeeCheck = false;
                    let reportedToCheck = false;
                    let statusCheck = false;
                    let durationCheck = false;
                    let locationCheck = false;
                    let medicationsCheck = false;
                    let interventionsCheck = false;
                    let typeCheck = false;

                    // search existing employee records for match on employee name //

                    if (!breakCheck) {
                    employees.forEach(function (employee) {
                        if (
                        employee.firstName.toString().localeCompare(firstName) == 0 &&
                        employee.lastName.toString().localeCompare(lastName) == 0
                        ) {
                        consultRecord.employee = employee;
                        employeeCheck = true;
                        }
                    });
                    if (employeeCheck == false) {
                        breakCheck = true;
                    }
                    }

                    // check duration //

                    if (!breakCheck) {
                    if (duration.localeCompare(Duration.One.toString()) == 0) {
                        consultRecord.duration = Duration.One;
                        durationCheck = true;
                    } else if (duration.localeCompare(Duration.Five.toString()) == 0) {
                        consultRecord.duration = Duration.Five;
                        durationCheck = true;
                    } else if (duration.localeCompare(Duration.Fifteen.toString()) == 0) {
                        consultRecord.duration = Duration.Fifteen;
                        durationCheck = true;
                    } else if (duration.localeCompare(Duration.Thirty.toString()) == 0) {
                        consultRecord.duration = Duration.Thirty;
                        durationCheck = true;
                    } else if (duration.localeCompare(Duration.Sixty.toString()) == 0) {
                        consultRecord.duration = Duration.Sixty;
                        durationCheck = true;
                    } else if (duration.localeCompare(Duration.Ninety.toString()) == 0) {
                        consultRecord.duration = Duration.Ninety;
                        durationCheck = true;
                    } else {
                        breakCheck = true;
                    }
                    }

                    // check consult type //

                    if (!breakCheck) {
                    consultTypes.forEach(function (ConsultTypes) {
                        if (consultType.localeCompare(ConsultTypes.name.toString()) == 0) {
                        consultRecord.consultType = ConsultTypes;
                        typeCheck = true;
                        }
                    });
                    if (!typeCheck) {
                        breakCheck = true;
                    }
                    }

                    // check date //

                    if (!breakCheck) {
                    const date = new Date(timestamp);
                    if (
                        date.getFullYear() == null ||
                        date.getMonth() == null ||
                        date.getDate() == null ||
                        date.getTime() == null ||
                        date < earlyDate ||
                        date > curDate
                    ) {
                        breakCheck = true;
                    } else {
                        consultRecord.consultDate = date;
                    }
                    }

                    // check status - notably, in-progress, not completed, and investigating statuses are only used for task list management //
                    // i.e. no valid record will have these statuses, so if one did, it should not be stored //

                    if (
                    breakCheck ||
                    status.localeCompare(Status.In_Progress.toString()) == 0 ||
                    status.localeCompare(Status.Not_Completed.toString()) == 0 ||
                    status.localeCompare(Status.Investigating.toString()) == 0
                    ) {
                        breakCheck = true;
                        } else if (status.localeCompare(Status.Abbreviated.toString()) == 0) {
                            consultRecord.status = Status.Abbreviated;
                            statusCheck = true;
                            // abbreviated note logic - at this point in program execution, abbreviated note record has all values it needs //
                            breakCheck = true;
                            consults.push({ ...consultRecord });
                        } else if (status.localeCompare(Status.Completed.toString()) == 0) {
                            consultRecord.status = Status.Completed;
                            statusCheck = true;
                        } else {
                            breakCheck = true;
                    }

                    // check assisting employee name //

                    if (!breakCheck && assistFirstName.localeCompare("") != 0 && assistLastName.localeCompare("") != 0) {
                    employees.forEach(function (employee) {
                        if (
                        employee.firstName.toString().localeCompare(assistFirstName) == 0 &&
                        employee.lastName.toString().localeCompare(assistLastName) == 0
                        ) {
                        consultRecord.asstEmployeeId = employee;
                        asstEmployeeCheck = true;
                        }
                    });
                    } else if (assistFirstName.localeCompare("") == 0 && assistLastName.localeCompare("") == 0) {
                    asstEmployeeCheck = true;
                    }

                    // check referred to name //

                    if (!breakCheck && pharmacistFirstName.localeCompare("") != 0 && pharmacistLastName.localeCompare("") != 0) {
                    employees.forEach(function (employee) {
                        if (
                        employee.firstName.toString().localeCompare(pharmacistFirstName) == 0 &&
                        employee.lastName.toString().localeCompare(pharmacistLastName) == 0 &&
                        employee.isPharmacist == true
                        ) {
                        consultRecord.reportedToId = employee;
                        reportedToCheck = true;
                        }
                    });
                    } else if (pharmacistFirstName.localeCompare("") == 0 && pharmacistFirstName.localeCompare("") == 0) {
                    reportedToCheck = true;
                    } else {
                    breakCheck = true;
                    }

                    // check location //

                    if (!breakCheck && location.localeCompare("") != 0) {
                        locations.forEach(function (Location) {
                            if (location.localeCompare(Location.name.toString())) {
                                consultRecord.location = Location;
                                locationCheck = true;
                            }
                        });
                        if (!locationCheck) {
                            breakCheck = true;
                        }
                    }

                    // check number of meds //

                    if (!breakCheck) {
                        if(medications.localeCompare('') != 0) {
                           const meds = parseInt(medications);
                            for (let counter = 0; counter <= 255; counter++) {
                                if (counter == meds) {
                                    consultRecord.medications = counter;
                                    medicationsCheck = true;
                                }
                            }
                        }
                        if (!medicationsCheck) {
                            breakCheck = true;
                        }
                    }

                    // check number of interventions //

                    if (!breakCheck) {
                        if (interventions.localeCompare('') != 0) {
                            const ints = parseInt(interventions);
                            for (let counter = 0; counter <= 255; counter++) {
                                if (counter == ints) {
                                    consultRecord.interventions = counter;
                                    interventionsCheck = true;
                                }
                            }
                        }
                        if (!interventionsCheck) {
                            breakCheck = true;
                        }
                    }

                    // check bools //

                    if (!breakCheck) {
                        if (request == null || request.toLowerCase() === 'false') {
                            consultRecord.isRequest = false;
                        } else if (request.toLowerCase() == 'true') {
                            consultRecord.isRequest = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    if (!breakCheck) {
                        if (missingMedications == null || missingMedications.toLowerCase() === 'false') {
                            consultRecord.isInterventionMissing = false;
                        } else if (request.toLowerCase() == 'true') {
                            consultRecord.isInterventionMissing = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    if (!breakCheck) {
                        if (notTaking == null || notTaking.toLowerCase() === 'false') {
                            consultRecord.isInterventionNotTaking = false;
                        } else if (notTaking.toLowerCase() == 'true') {
                            consultRecord.isInterventionNotTaking = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    if (!breakCheck) {
                        if (incorrectDose == null || incorrectDose.toLowerCase() === 'false') {
                            consultRecord.isInterventionIncorrectDose = false;
                        } else if (incorrectDose.toLowerCase() == 'true') {
                            consultRecord.isInterventionIncorrectDose = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    if (!breakCheck) {
                        if (incorrectFrequency == null || incorrectFrequency.toLowerCase() === 'false') {
                            consultRecord.isInterventionIncorrectFrequency = false;
                        } else if (incorrectFrequency.toLowerCase() == 'true') {
                            consultRecord.isInterventionIncorrectFrequency = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    if (!breakCheck) {
                        if (incorrectMedication == null || incorrectMedication.toLowerCase() === 'false') {
                            consultRecord.isInterventionIncorrectMedication = false;
                        } else if (incorrectMedication.toLowerCase() == 'true') {
                            consultRecord.isInterventionIncorrectMedication = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    if (!breakCheck) {
                        if (incorrectRoute == null || incorrectRoute.toLowerCase() === 'false') {
                            consultRecord.isInterventionIncorrectRoute = false;
                        } else if (incorrectRoute.toLowerCase() == 'true') {
                            consultRecord.isInterventionIncorrectRoute = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    if (!breakCheck) {
                        if (allergy == null || allergy.toLowerCase() === 'false') {
                            consultRecord.isInterventionAllergiesUpdated = false;
                        } else if (allergy.toLowerCase() == 'true') {
                            consultRecord.isInterventionAllergiesUpdated = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    if (!breakCheck) {
                        if (vaccination == null || vaccination.toLowerCase() === 'false') {
                            consultRecord.isInterventionVaccinationDocumented = false;
                        } else if (vaccination.toLowerCase() == 'true') {
                            consultRecord.isInterventionVaccinationDocumented = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    if (!breakCheck) {
                        if (admit == null || admit.toLowerCase() === 'false') {
                            consultRecord.isAdmitOrdersPlaced = false;
                        } else if (admit.toLowerCase() == 'true') {
                            consultRecord.isAdmitOrdersPlaced = true;
                        } else {
                            breakCheck = true;
                        }
                    }

                    // if all data validations succeeded, increment id and assign id to consult record, then add consult record to consults array //

                    if (!breakCheck) {
                        if (
                            employeeCheck &&
                            asstEmployeeCheck &&
                            reportedToCheck &&
                            statusCheck &&
                            durationCheck &&
                            locationCheck &&
                            medicationsCheck &&
                            interventionsCheck &&
                            typeCheck
                        ) {
                            ++id;
                            consultRecord.id = id;
                            consults.push({ ...consultRecord });
                        }
                    }
                }
            }
            await consultsRepo.save(consults);
            console.log('Consult records saved');

            // end file upload logic //

            // start employee statistics calculation logic //

            serviceStatisticRepo.clear();
            employeeStatisticRepo.clear();
          
            const serviceStatistics: ServiceStatistic[] = [];
            const employeeStatistics: EmployeeStatistic[] = [];

            const dates: Date[] = [];
            const rawDates = await consultsRepo
              .createQueryBuilder('consult')
              .select('DATE_FORMAT(consult.consult_date, "%Y%m%d") AS date')
              .distinct(true)
              .getRawMany();
          
            // load array (dates) with date objects with correctly loaded month, day, and year //
          
            rawDates.forEach(function (item) {
              const splitDate = item.date.split('%');
              const year = splitDate[0];
              const month = splitDate[1];
              const day = splitDate[2];
              const newDate = new Date();
              newDate.setFullYear(parseInt(year));
              newDate.setMonth(parseInt(month));
              newDate.setDate(parseInt(day));
              dates.push(newDate);
            });

            const employeeIDs: Employee[] = await employeeRepo.createQueryBuilder('employee').select('employee.id').getMany();

            dates.forEach(function (DateItem) {
                employeeIDs.forEach(async function (Employee) {
                    const employeeStatisticsRecord = new EmployeeStatistic();

                    const year = DateItem.getFullYear().toString();
                    const month = (DateItem.getMonth() + 1).toString();
                    const day = (DateItem.getDate() + 1).toString();
                    if (month.length == 1) {
                      month.padStart(2, '0');
                    }
                    if (day.length == 1) {
                      day.padStart(2, '0');
                    }
                    const mySqlFormattedDay = year.concat(month, day);

                    const dateObject = new Date(mySqlFormattedDay);

                    employeeStatisticsRecord.numberConsultNotes = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .andWhere('consult.status = :status', { status: 'Completed' })
                        .getCount();

                    employeeStatisticsRecord.numberAbbreviatedNotes = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .andWhere('consult.status = :status', { status: 'Abbreviated' })
                        .getCount();

                    employeeStatisticsRecord.numberNotes = employeeStatisticsRecord.numberConsultNotes + employeeStatisticsRecord.numberAbbreviatedNotes;

                    employeeStatisticsRecord.numberMedications = (
                        await consultsRepo
                        .createQueryBuilder('consult')
                        .select('SUM(consult.medications)', 'sum')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .getRawOne()
                    ).sum;

                    employeeStatisticsRecord.averageMedicationsPerConsult =
                        employeeStatisticsRecord.numberMedications / employeeStatisticsRecord.numberConsultNotes;

                    employeeStatisticsRecord.numberInterventions = (
                        await consultsRepo
                        .createQueryBuilder('consult')
                        .select('SUM(consult.interventions)', 'sum')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .getRawOne()
                    ).sum;

                    employeeStatisticsRecord.averageInterventionsPerConsult =
                        employeeStatisticsRecord.numberInterventions / employeeStatisticsRecord.numberConsultNotes;

                    const times = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult.duration', 'time')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .getRawMany();

                    let totalTimeInMinutes = 0;
                    times.forEach(function (time) {
                        if (time.time.localeCompare('<1 Minute') == 0) {
                        totalTimeInMinutes += 1;
                        }
                        if (time.time.localeCompare('1-5 Minutes') == 0) {
                        totalTimeInMinutes += 5;
                        }
                        if (time.time.localeCompare('6-15 Minutes') == 0) {
                        totalTimeInMinutes += 15;
                        }
                        if (time.time.localeCompare('16-30 Minutes') == 0) {
                        totalTimeInMinutes += 30;
                        }
                        if (time.time.localeCompare('31-60 Minutes') == 0) {
                        totalTimeInMinutes += 60;
                        }
                        if (time.time.localeCompare('>1 Hour') == 0) {
                        totalTimeInMinutes += 90;
                        }
                    });

                    employeeStatisticsRecord.averageTimePerConsult = totalTimeInMinutes / employeeStatisticsRecord.numberNotes;

                    employeeStatisticsRecord.numberRequests = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .andWhere('consult.is_request = :request', { request: true })
                        .getCount();

                    employeeStatisticsRecord.numberReferredToPharmacist = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .andWhere(new NotBrackets((qb) => qb.where('consult.reported_to_id = :referred', { referred: null })))
                        .getCount();

                    employeeStatisticsRecord.numberEmergencyRoom = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .andWhere('consult.location = :location', { location: '1' })
                        .getCount();

                    employeeStatisticsRecord.numberIntensiveCareUnit = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .andWhere('consult.location = :location', { location: '2' })
                        .getCount();

                    employeeStatisticsRecord.numberProgressiveCareUnit = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .andWhere('consult.location = :location', { location: '3' })
                        .getCount();

                    employeeStatisticsRecord.numberMissouriPsychiatricCenter = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .andWhere('consult.location = :location', { location: '4' })
                        .getCount();

                    employeeStatisticsRecord.numberOther = await consultsRepo
                        .createQueryBuilder('consult')
                        .select('consult')
                        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
                        .andWhere('consult.employee = :employee', { employee: Employee.id })
                        .andWhere('consult.location = :location', { location: '5' })
                        .getCount();

                    // add to employeeStatistics array //

                    employeeStatistics.push({ ...employeeStatisticsRecord });

            
                });
            });
            await employeeStatisticRepo.save(employeeStatistics);

            // end employee statistics calculation logic //

            // start service statistics calculation //

            dates.forEach(async function (DateElement) {

                const serviceStatisticsRecord = new ServiceStatistic();

                const year = DateElement.getFullYear().toString();
                const month = (DateElement.getMonth() + 1).toString();
                const day = (DateElement.getDate() + 1).toString();
                if (month.length == 1) {
                  month.padStart(2, '0');
                }
                if (day.length == 1) {
                  day.padStart(2, '0');
                }
                const mysqlDate = year.concat('-', month, '-', day);
                const mySqlFormattedDay2 = mysqlDate;
                serviceStatisticsRecord.day = new Date(mySqlFormattedDay2);
              
                serviceStatisticsRecord.numberConsultNotes = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_consult_notes)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                serviceStatisticsRecord.numberAbbreviatedNotes = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_abbreviated_notes)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                const numConsultNotes = serviceStatisticsRecord.numberConsultNotes.valueOf();
                const numAbbreviatedNotes = serviceStatisticsRecord.numberAbbreviatedNotes.valueOf();
                serviceStatisticsRecord.numberNotes = +numConsultNotes + +numAbbreviatedNotes;
              
                serviceStatisticsRecord.numberMedications = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_medications)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                serviceStatisticsRecord.averageMedicationsPerConsult = serviceStatisticsRecord.numberMedications / serviceStatisticsRecord.numberConsultNotes;
              
                serviceStatisticsRecord.numberInterventions = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_interventions)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                serviceStatisticsRecord.averageInterventionsPerConsult = serviceStatisticsRecord.numberInterventions / serviceStatisticsRecord.numberConsultNotes;
              
                const numRecords = await employeeStatisticRepo
                  .createQueryBuilder('employee_statistics')
                  .select()
                  .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                  .getCount();
              
                serviceStatisticsRecord.averageTimePerConsult =
                  (
                    await employeeStatisticRepo
                      .createQueryBuilder('employee_statistics')
                      .select('SUM(employee_statistics.average_time_per_consult)', 'sum')
                      .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                      .getRawOne()
                  ).sum / numRecords;
              
                serviceStatisticsRecord.numberRequests = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_requests)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                serviceStatisticsRecord.numberReferredToPharmacist = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_referred_to_pharmacist)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                serviceStatisticsRecord.numberEmergencyRoom = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_emergency_room)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                serviceStatisticsRecord.numberIntensiveCareUnit = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_intensive_care_unit)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                serviceStatisticsRecord.numberProgressiveCareUnit = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_progressive_care_unit)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                serviceStatisticsRecord.numberMissouriPsychiatricCenter = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_missouri_psychiatric_center)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                serviceStatisticsRecord.numberOther = (
                  await employeeStatisticRepo
                    .createQueryBuilder('employee_statistics')
                    .select('SUM(employee_statistics.number_other)', 'sum')
                    .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
                    .getRawOne()
                ).sum;
              
                // add to serviceStatistics array //
              
                serviceStatistics.push({ ...serviceStatisticsRecord });
            });
            await serviceStatisticRepo.save(serviceStatistics);

            // end service statistics logic //

            res.send("File successfully uploaded and statistics recalculated.");
        }
        else {
            console.log('null file');
        }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error fetching consults types', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
