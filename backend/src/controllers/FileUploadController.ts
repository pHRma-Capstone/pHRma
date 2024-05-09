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

  employeeRepo = db.getRepository(Employee);
  locationRepo = db.getRepository(Location);
  consultTypesRepo = db.getRepository(ConsultType);
  consultsRepo = db.getRepository(Consult);
  employeeStatisticRepo = db.getRepository(EmployeeStatistic);
  serviceStatisticRepo = db.getRepository(ServiceStatistic);

  employees: Employee[] = [];
  locations: Location[] = [];
  consultTypes: ConsultType[] = [];
  consults: Consult[] = [];
  employeeStatistics: EmployeeStatistic[] = [];
  serviceStatistics: ServiceStatistic[] = [];

  consult_id: number = 0;

  async fetchEmployees() {
    this.employees = await this.employeeRepo.createQueryBuilder('employee').select().getMany();
  }

  async fetchLocations() {
    this.locations = await this.locationRepo.createQueryBuilder('locations').select().getMany();
  }

  async fetchConsultTypes() {
    this.consultTypes = await this.consultTypesRepo.createQueryBuilder('consult_types').select().getMany();
  }

  clearConsultsArray() {
    while (this.consults.length != 0) {
      this.consults.pop();
    }
  }

  clearEmployeeStatisticsArray() {
    while (this.employeeStatistics.length != 0) {
      this.employeeStatistics.pop();
    }
  }

  clearServiceStatisticsArray() {
    while (this.serviceStatistics.length != 0) {
      this.serviceStatistics.pop();
    }
  }

  getConsultsRepo() {
    return this.consultsRepo;
  }

  getEmployeeStatisticsRepo() {
    return this.employeeStatisticRepo;
  }

  getServiceStatisticsRepo() {
    return this.serviceStatisticRepo;
  }

  getConsults() {
    return this.consults;
  }

  getConsultTypes() {
    return this.consultTypes;
  }

  getLocations() {
    return this.locations;
  }

  getEmployeeStatistics() {
    return this.employeeStatistics;
  }

  getServiceStatistics() {
    return this.serviceStatistics;
  }

  getEmployees() {
    return this.employees;
  }

  async setConsultIds() {
    const consultsRepo = this.consultsRepo;
    const max_existing_id: number = (await consultsRepo.createQueryBuilder('consults').select('MAX(consults.id) AS max').getRawOne()).max;
    let id = max_existing_id + 1;

    for (let counter = 0; counter < this.consults.length; counter++) {
      this.consults[counter].id = id;
      id++;
    }
  }

  async clearConsults() {
    await this.consultsRepo.clear();
  }

  async clearEmployeeStatistics() {
    await this.employeeStatisticRepo.clear();
  }

  async clearServiceStatistics() {
    await this.serviceStatisticRepo.clear();
  }

  async parseFile(splitByNewLine: string[]) {
    const numInputFileEntries = splitByNewLine.length;
    const consults = this.getConsults();

    for (let counter = 0; counter < numInputFileEntries; counter++) {
      console.log(splitByNewLine[counter]);
      const splitByComma = splitByNewLine[counter].split(',');
      const consultRecord = await this.parseLine(splitByComma);
      if (consultRecord != null) {
        consults.push({ ...consultRecord });
      }
    }
    this.setConsultsArray(consults);
  }

  async parseLine(splitByComma: string[]) {
    const employees = this.getEmployees();
    const locations = this.getLocations();
    const consultTypes = this.getConsultTypes();
    const consults = this.getConsults();

    // define bounds for allowable date values for later comparison //

    const earlyDate = new Date('January 1, 2010');
    const curDate = new Date();
    curDate.setDate(curDate.getDate() + 1);

    if (splitByComma.length == 24) {
      const consultType = splitByComma[0];
      const timestamp = splitByComma[1];
      const lastName = splitByComma[2];
      const firstName = splitByComma[3];
      const assistLastName = splitByComma[4];
      const assistFirstName = splitByComma[5];
      const status = splitByComma[6];
      const location = splitByComma[7];
      const admit = splitByComma[8];
      const medications = splitByComma[9];
      const interventions = splitByComma[10];
      const request = splitByComma[11];
      const missingMedications = splitByComma[12];
      const notTaking = splitByComma[13];
      const incorrectMedication = splitByComma[14];
      const incorrectDose = splitByComma[15];
      const incorrectFrequency = splitByComma[16];
      const incorrectRoute = splitByComma[17];
      const allergy = splitByComma[18];
      const vaccination = splitByComma[19];
      const duration = splitByComma[20];
      // skip index [21] //
      // this is the comments field which could potentially contain protected health information //
      // since it is just a free text field entered by user with no defined values //
      // this also is a potential vulnerability to sql injection if someone managed to find a way to escape //
      // the ORM query parameterization as it is a free-text user generated string //
      // so best solution is just to discard it //
      const pharmacistLastName = splitByComma[22].toString();
      const pharmacistFirstName = splitByComma[23].toString().replace('\n', '').slice(0, -1);

      // check non-nullable values //

      // defining breakCheck boolean for program control/efficiency as foreach function does not have simple break functionality //

      let breakCheck = false;

      if (firstName == null || lastName == null || consultType == null || duration == null || status == null) {
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
      let abbreviatedCheck = false;

      // search existing employee records for match on employee name //

      if (!breakCheck) {
        employees.forEach(function (employee) {
          if (employee.firstName.toString().localeCompare(firstName) == 0 && employee.lastName.toString().localeCompare(lastName) == 0) {
            consultRecord.employee = employee;
            employeeCheck = true;
          }
        });
        if (employeeCheck == false) {
          breakCheck = true;
          console.log('broke at employee');
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
          console.log('broke at duration');
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
          console.log('broke at type');
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
          console.log('broke at date');
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
        abbreviatedCheck = true;
        consults.push({ ...consultRecord });
      } else if (status.localeCompare(Status.Completed.toString()) == 0) {
        consultRecord.status = Status.Completed;
        statusCheck = true;
      } else {
        breakCheck = true;
        console.log('broke at status');
      }

      // check assisting employee name //

      if (!breakCheck && assistFirstName.localeCompare('') != 0 && assistLastName.localeCompare('') != 0) {
        employees.forEach(function (employee) {
          if (employee.firstName.toString().localeCompare(assistFirstName) == 0 && employee.lastName.toString().localeCompare(assistLastName) == 0) {
            consultRecord.asstEmployeeId = employee;
            asstEmployeeCheck = true;
          }
        });
      } else if (assistFirstName.localeCompare('') == 0 && assistLastName.localeCompare('') == 0) {
        asstEmployeeCheck = true;
      }

      // check pharmacist //

      if (!breakCheck && pharmacistFirstName.localeCompare('') != 0 && pharmacistLastName.localeCompare('') != 0) {
        employees.forEach(function (pharmacist) {
          if (pharmacist.isPharmacist.toString().toLowerCase() === 'true') {
            if (
              pharmacist.firstName.toString().localeCompare(pharmacistFirstName) == 0 &&
              pharmacist.lastName.toString().localeCompare(pharmacistLastName) == 0
            ) {
              consultRecord.reportedToId = pharmacist;
              reportedToCheck = true;
            } else {
              //console.log('did not match pharmacist');
            }
          }
        });
      } else {
        reportedToCheck = true;
      }

      // check location //

      if (!breakCheck && location.localeCompare('') != 0) {
        locations.forEach(function (Location) {
          if (location.localeCompare(Location.name.toString())) {
            consultRecord.location = Location;
            locationCheck = true;
          }
        });
        if (!locationCheck) {
          breakCheck = true;
          console.log('broke at location');
        }
      }

      // check number of meds //

      if (!breakCheck) {
        if (medications.localeCompare('') != 0) {
          const meds = Number(medications);
          for (let counter = 0; counter <= 255; counter++) {
            if (counter == meds) {
              consultRecord.medications = counter;
              medicationsCheck = true;
            }
          }
        }
        if (!medicationsCheck) {
          breakCheck = true;
          console.log('broke at meds');
        }
      }

      // check number of interventions //

      if (!breakCheck) {
        if (interventions.localeCompare('') != 0) {
          const ints = Number(interventions);
          for (let counter = 0; counter <= 255; counter++) {
            if (counter == ints) {
              consultRecord.interventions = counter;
              interventionsCheck = true;
            }
          }
        }
        if (!interventionsCheck) {
          breakCheck = true;
          console.log('broke at interventions');
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
          console.log('broke at request');
        }
      }

      if (!breakCheck) {
        if (missingMedications == null || missingMedications.toLowerCase() === 'false' || missingMedications.localeCompare('') == 0) {
          consultRecord.isInterventionMissing = false;
        } else if (missingMedications.toLowerCase() === 'true') {
          consultRecord.isInterventionMissing = true;
        } else {
          breakCheck = true;
          console.log('broke at bool - missing meds');
        }
      }

      if (!breakCheck) {
        if (notTaking == null || notTaking.toLowerCase() === 'false') {
          consultRecord.isInterventionNotTaking = false;
        } else if (notTaking.toLowerCase() == 'true') {
          consultRecord.isInterventionNotTaking = true;
        } else {
          breakCheck = true;
          console.log('broke at bool - not taking');
        }
      }

      if (!breakCheck) {
        if (incorrectDose == null || incorrectDose.toLowerCase() === 'false') {
          consultRecord.isInterventionIncorrectDose = false;
        } else if (incorrectDose.toLowerCase() == 'true') {
          consultRecord.isInterventionIncorrectDose = true;
        } else {
          breakCheck = true;
          console.log('broke at bool - incorrect dose');
        }
      }

      if (!breakCheck) {
        if (incorrectFrequency == null || incorrectFrequency.toLowerCase() === 'false') {
          consultRecord.isInterventionIncorrectFrequency = false;
        } else if (incorrectFrequency.toLowerCase() == 'true') {
          consultRecord.isInterventionIncorrectFrequency = true;
        } else {
          breakCheck = true;
          console.log('broke at bool - incorrect frequency');
        }
      }

      if (!breakCheck) {
        if (incorrectMedication == null || incorrectMedication.toLowerCase() === 'false') {
          consultRecord.isInterventionIncorrectMedication = false;
        } else if (incorrectMedication.toLowerCase() == 'true') {
          consultRecord.isInterventionIncorrectMedication = true;
        } else {
          breakCheck = true;
          console.log('broke at bool - incorrect medication');
        }
      }

      if (!breakCheck) {
        if (incorrectRoute == null || incorrectRoute.toLowerCase() === 'false') {
          consultRecord.isInterventionIncorrectRoute = false;
        } else if (incorrectRoute.toLowerCase() == 'true') {
          consultRecord.isInterventionIncorrectRoute = true;
        } else {
          breakCheck = true;
          console.log('broke at bool - incorrect route');
        }
      }

      if (!breakCheck) {
        if (allergy == null || allergy.toLowerCase() === 'false') {
          consultRecord.isInterventionAllergiesUpdated = false;
        } else if (allergy.toLowerCase() == 'true') {
          consultRecord.isInterventionAllergiesUpdated = true;
        } else {
          breakCheck = true;
          console.log('broke at bool - allergies');
        }
      }

      if (!breakCheck) {
        if (vaccination == null || vaccination.toLowerCase() === 'false') {
          consultRecord.isInterventionVaccinationDocumented = false;
        } else if (vaccination.toLowerCase() == 'true') {
          consultRecord.isInterventionVaccinationDocumented = true;
        } else {
          breakCheck = true;
          console.log('broke at bool - vaccinations');
        }
      }

      if (!breakCheck) {
        if (admit == null || admit.toLowerCase() === 'false') {
          consultRecord.isAdmitOrdersPlaced = false;
        } else if (admit.toLowerCase() == 'true') {
          consultRecord.isAdmitOrdersPlaced = true;
        } else {
          breakCheck = true;
          console.log('broke at bool - admit orders');
        }
      }

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
          return consultRecord;
        } else {
          return null;
        }
      } else {
        if (abbreviatedCheck == false) {
          console.log('broke at final check');
        }
      }
    } else {
      console.log('incorrect input file structure');
    }
  }

  async getUpdatedEmployeeStatistics() {
    const employeeStatistics = this.getEmployeeStatistics();
    const consultsRepo = this.getConsultsRepo();
    const dates: Date[] = [];

    const rawDates = await consultsRepo.createQueryBuilder('consult').select('DISTINCT DATE_FORMAT(consult_date, "%Y%%%m%%%d") AS date').getRawMany();

    rawDates.forEach(function (item) {
      const splitDate = item.date.split('%');
      const year = splitDate[0];
      const month = splitDate[1];
      const day = splitDate[2];
      const newDate = new Date(Number(year), Number(month) - 1, Number(day));
      dates.push(newDate);
    });

    for (let counter = 0; counter < dates.length; counter++) {
      await this.getUpdatedEmployeeStatisticsByDay(dates[counter]);
    }
    this.setEmployeeStatisticsArray(employeeStatistics);
  }

  async getUpdatedEmployeeStatisticsByDay(date: Date) {
    const employeeIDs: Employee[] = await this.employeeRepo.createQueryBuilder('employee').select('employee.id').getMany();
    for (let counter = 0; counter < employeeIDs.length; counter++) {
      const employeeStatisticsRecord = await this.getUpdatedEmployeeStatisticsByDayAndEmployee(date, employeeIDs[counter]);
      this.employeeStatistics.push({ ...employeeStatisticsRecord });
    }
  }

  async getUpdatedEmployeeStatisticsByDayAndEmployee(DateItem: Date, employee: Employee) {
    const consultsRepo = this.getConsultsRepo();

    const employeeStatisticsRecord = new EmployeeStatistic();

    employeeStatisticsRecord.employee = employee;

    const year = DateItem.getFullYear().toString();
    const month = (DateItem.getMonth() + 1).toString().padStart(2, '0');
    const day = DateItem.getDate().toString().padStart(2, '0');
    const mySqlFormattedDay = year.concat(month, day);
    const dateObject = new Date(Number(year), Number(month) - 1, Number(day));
    employeeStatisticsRecord.day = dateObject;

    employeeStatisticsRecord.numberConsultNotes = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .andWhere('consult.status = :status', { status: 'Completed' })
      .getCount();
    if (employeeStatisticsRecord.numberConsultNotes == null) {
      employeeStatisticsRecord.numberConsultNotes = 0;
    }
    if (employeeStatisticsRecord.numberConsultNotes > 255) {
      employeeStatisticsRecord.numberConsultNotes = 255;
    }

    employeeStatisticsRecord.numberAbbreviatedNotes = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .andWhere('consult.status = :status', { status: 'Abbreviated' })
      .getCount();
    if (employeeStatisticsRecord.numberAbbreviatedNotes == null) {
      employeeStatisticsRecord.numberAbbreviatedNotes = 0;
    }
    if (employeeStatisticsRecord.numberAbbreviatedNotes > 255) {
      employeeStatisticsRecord.numberAbbreviatedNotes = 255;
    }

    employeeStatisticsRecord.numberNotes = employeeStatisticsRecord.numberConsultNotes + employeeStatisticsRecord.numberAbbreviatedNotes;
    if (employeeStatisticsRecord.numberNotes > 255) {
      employeeStatisticsRecord.numberNotes = 255;
    }

    employeeStatisticsRecord.numberMedications = (
      await consultsRepo
        .createQueryBuilder('consult')
        .select('SUM(consult.medications)', 'sum')
        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
        .andWhere('consult.employee = :employee', { employee: employee.id })
        .getRawOne()
    ).sum;
    if (employeeStatisticsRecord.numberMedications == null) {
      employeeStatisticsRecord.numberMedications = 0;
    }
    if (employeeStatisticsRecord.numberMedications > 65535) {
      employeeStatisticsRecord.numberMedications = 65535;
    }

    if (employeeStatisticsRecord.numberConsultNotes != 0 && employeeStatisticsRecord.numberMedications) {
      employeeStatisticsRecord.averageMedicationsPerConsult =
        Number(employeeStatisticsRecord.numberMedications) / Number(employeeStatisticsRecord.numberConsultNotes);
    } else {
      employeeStatisticsRecord.averageMedicationsPerConsult = 0;
    }
    if (employeeStatisticsRecord.averageMedicationsPerConsult > 255) {
      employeeStatisticsRecord.averageMedicationsPerConsult = 255;
    }

    employeeStatisticsRecord.numberInterventions = (
      await consultsRepo
        .createQueryBuilder('consult')
        .select('SUM(consult.interventions)', 'sum')
        .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
        .andWhere('consult.employee = :employee', { employee: employee.id })
        .getRawOne()
    ).sum;
    if (employeeStatisticsRecord.numberInterventions == null) {
      employeeStatisticsRecord.numberInterventions = 0;
    }
    if (employeeStatisticsRecord.numberInterventions > 65535) {
      employeeStatisticsRecord.numberInterventions = 65535;
    }

    if (employeeStatisticsRecord.numberConsultNotes != 0) {
      employeeStatisticsRecord.averageInterventionsPerConsult =
        Number(employeeStatisticsRecord.numberInterventions) / Number(employeeStatisticsRecord.numberConsultNotes);
    } else {
      employeeStatisticsRecord.averageInterventionsPerConsult = 0;
    }
    if (employeeStatisticsRecord.averageInterventionsPerConsult > 255) {
      employeeStatisticsRecord.averageInterventionsPerConsult = 255;
    }

    const times = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult.duration', 'time')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
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

    if (employeeStatisticsRecord.numberNotes != 0) {
      employeeStatisticsRecord.averageTimePerConsult = totalTimeInMinutes / Number(employeeStatisticsRecord.numberNotes);
    } else {
      employeeStatisticsRecord.averageTimePerConsult = 0;
    }
    if (employeeStatisticsRecord.averageTimePerConsult > 255) {
      employeeStatisticsRecord.averageTimePerConsult = 255;
    }

    employeeStatisticsRecord.numberRequests = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .andWhere('consult.is_request = :request', { request: true })
      .getCount();
    if (employeeStatisticsRecord.numberRequests == null) {
      employeeStatisticsRecord.numberRequests = 0;
    }
    if (employeeStatisticsRecord.numberRequests > 255) {
      employeeStatisticsRecord.numberRequests = 255;
    }

    employeeStatisticsRecord.numberReferredToPharmacist = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .andWhere(new NotBrackets((qb) => qb.where('consult.reportedToIdId = :referred', { referred: null })))
      .getCount();
    if (employeeStatisticsRecord.numberReferredToPharmacist == null) {
      employeeStatisticsRecord.numberReferredToPharmacist = 0;
    }
    if (employeeStatisticsRecord.numberReferredToPharmacist > 255) {
      employeeStatisticsRecord.numberReferredToPharmacist = 255;
    }

    employeeStatisticsRecord.numberEmergencyRoom = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .andWhere('consult.location = :location', { location: '1' })
      .getCount();
    if (employeeStatisticsRecord.numberEmergencyRoom == null) {
      employeeStatisticsRecord.numberEmergencyRoom = 0;
    }
    if (employeeStatisticsRecord.numberEmergencyRoom > 255) {
      employeeStatisticsRecord.numberEmergencyRoom = 255;
    }

    employeeStatisticsRecord.numberIntensiveCareUnit = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .andWhere('consult.location = :location', { location: '2' })
      .getCount();
    if (employeeStatisticsRecord.numberIntensiveCareUnit == null) {
      employeeStatisticsRecord.numberIntensiveCareUnit = 0;
    }
    if (employeeStatisticsRecord.numberIntensiveCareUnit > 255) {
      employeeStatisticsRecord.numberIntensiveCareUnit = 255;
    }

    employeeStatisticsRecord.numberProgressiveCareUnit = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .andWhere('consult.location = :location', { location: '3' })
      .getCount();
    if (employeeStatisticsRecord.numberProgressiveCareUnit == null) {
      employeeStatisticsRecord.numberProgressiveCareUnit = 0;
    }
    if (employeeStatisticsRecord.numberProgressiveCareUnit > 255) {
      employeeStatisticsRecord.numberProgressiveCareUnit = 255;
    }

    employeeStatisticsRecord.numberMissouriPsychiatricCenter = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .andWhere('consult.location = :location', { location: '4' })
      .getCount();
    if (employeeStatisticsRecord.numberMissouriPsychiatricCenter == null) {
      employeeStatisticsRecord.numberMissouriPsychiatricCenter = 0;
    }
    if (employeeStatisticsRecord.numberMissouriPsychiatricCenter > 255) {
      employeeStatisticsRecord.numberMissouriPsychiatricCenter = 255;
    }

    employeeStatisticsRecord.numberOther = await consultsRepo
      .createQueryBuilder('consult')
      .select('consult')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .andWhere('consult.location = :location', { location: '5' })
      .getCount();
    if (employeeStatisticsRecord.numberOther == null) {
      employeeStatisticsRecord.numberOther = 0;
    }
    if (employeeStatisticsRecord.numberOther > 255) {
      employeeStatisticsRecord.numberOther = 255;
    }

    return employeeStatisticsRecord;
  }

  async getUpdatedServiceStatistics() {
    const serviceStatistics = this.getServiceStatistics();
    const consultsRepo = this.getConsultsRepo();

    const dates: Date[] = [];
    const rawDates = await consultsRepo.createQueryBuilder('consult').select('DISTINCT DATE_FORMAT(consult_date, "%Y%%%m%%%d") AS date').getRawMany();

    // load array (dates) with date objects with correctly loaded month, day, and year //

    rawDates.forEach(function (item) {
      const splitDate = item.date.split('%');
      const year = splitDate[0];
      const month = splitDate[1];
      const day = splitDate[2];
      const newDate = new Date(Number(year), Number(month) - 1, Number(day));
      dates.push(newDate);
    });

    for (let counter = 0; counter < dates.length; counter++) {
      const serviceStatisticsRecord = await this.getUpdatedServiceStatisticsByDay(dates[counter]);
      serviceStatistics.push({ ...serviceStatisticsRecord });
    }

    this.setServiceStatisticsArray(serviceStatistics);
  }

  async getUpdatedServiceStatisticsByDay(dateItem: Date) {
    const employeeStatisticRepo = this.getEmployeeStatisticsRepo();

    const serviceStatisticsRecord = new ServiceStatistic();

    const year = dateItem.getFullYear().toString();
    const month = (dateItem.getMonth() + 1).toString().padStart(2, '0');
    const day = dateItem.getDate().toString().padStart(2, '0');

    const mysqlDate = year.concat('-', month, '-', day);
    const mySqlFormattedDay2 = mysqlDate;

    const mySqlRawDate = new Date(mySqlFormattedDay2);
    mySqlRawDate.setDate(mySqlRawDate.getDate() + 1);
    serviceStatisticsRecord.day = mySqlRawDate;

    serviceStatisticsRecord.numberConsultNotes = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_consult_notes)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberConsultNotes == null) {
      serviceStatisticsRecord.numberConsultNotes = 0;
    }
    if (serviceStatisticsRecord.numberConsultNotes > 255) {
      serviceStatisticsRecord.numberConsultNotes = 255;
    }

    serviceStatisticsRecord.numberAbbreviatedNotes = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_abbreviated_notes)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberAbbreviatedNotes == null) {
      serviceStatisticsRecord.numberAbbreviatedNotes = 0;
    }
    if (serviceStatisticsRecord.numberAbbreviatedNotes > 255) {
      serviceStatisticsRecord.numberAbbreviatedNotes = 255;
    }

    const numConsultNotes = serviceStatisticsRecord.numberConsultNotes;
    const numAbbreviatedNotes = serviceStatisticsRecord.numberAbbreviatedNotes;
    serviceStatisticsRecord.numberNotes = +numConsultNotes + +numAbbreviatedNotes;

    serviceStatisticsRecord.numberMedications = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_medications)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberMedications == null) {
      serviceStatisticsRecord.numberMedications = 0;
    }
    if (serviceStatisticsRecord.numberMedications > 65535) {
      serviceStatisticsRecord.numberMedications = 65535;
    }

    if (serviceStatisticsRecord.numberConsultNotes != 0) {
      serviceStatisticsRecord.averageMedicationsPerConsult = serviceStatisticsRecord.numberMedications / serviceStatisticsRecord.numberConsultNotes;
    } else {
      serviceStatisticsRecord.averageMedicationsPerConsult = 0;
    }
    if (serviceStatisticsRecord.averageMedicationsPerConsult > 255) {
      serviceStatisticsRecord.averageMedicationsPerConsult = 255;
    }

    serviceStatisticsRecord.numberInterventions = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_interventions)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberInterventions == null) {
      serviceStatisticsRecord.numberInterventions = 0;
    }
    if (serviceStatisticsRecord.numberInterventions > 65535) {
      serviceStatisticsRecord.numberInterventions = 65535;
    }

    if (serviceStatisticsRecord.numberConsultNotes != 0) {
      serviceStatisticsRecord.averageInterventionsPerConsult =
        serviceStatisticsRecord.numberInterventions / serviceStatisticsRecord.numberConsultNotes;
    } else {
      serviceStatisticsRecord.averageInterventionsPerConsult = 0;
    }
    if (serviceStatisticsRecord.averageInterventionsPerConsult > 255) {
      serviceStatisticsRecord.averageInterventionsPerConsult = 255;
    }

    const numRecords = await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select()
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
      .getCount();

    if (numRecords != 0 && numRecords != null) {
      serviceStatisticsRecord.averageTimePerConsult =
        (
          await employeeStatisticRepo
            .createQueryBuilder('employee_statistics')
            .select('SUM(employee_statistics.average_time_per_consult)', 'sum')
            .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
            .getRawOne()
        ).sum / numRecords;
    } else {
      serviceStatisticsRecord.averageTimePerConsult = 0;
    }
    if (serviceStatisticsRecord.averageTimePerConsult > 255) {
      serviceStatisticsRecord.averageTimePerConsult = 255;
    }

    serviceStatisticsRecord.numberRequests = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_requests)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberRequests == null) {
      serviceStatisticsRecord.numberRequests = 0;
    }
    if (serviceStatisticsRecord.numberRequests > 255) {
      serviceStatisticsRecord.numberRequests = 255;
    }

    serviceStatisticsRecord.numberReferredToPharmacist = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_referred_to_pharmacist)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberReferredToPharmacist == null) {
      serviceStatisticsRecord.numberReferredToPharmacist = 0;
    }
    if (serviceStatisticsRecord.numberReferredToPharmacist > 255) {
      serviceStatisticsRecord.numberReferredToPharmacist = 255;
    }

    serviceStatisticsRecord.numberEmergencyRoom = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_emergency_room)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberEmergencyRoom == null) {
      serviceStatisticsRecord.numberEmergencyRoom = 0;
    }
    if (serviceStatisticsRecord.numberEmergencyRoom > 255) {
      serviceStatisticsRecord.numberEmergencyRoom = 255;
    }

    serviceStatisticsRecord.numberIntensiveCareUnit = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_intensive_care_unit)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberIntensiveCareUnit == null) {
      serviceStatisticsRecord.numberIntensiveCareUnit = 0;
    }
    if (serviceStatisticsRecord.numberIntensiveCareUnit > 255) {
      serviceStatisticsRecord.numberIntensiveCareUnit = 255;
    }

    serviceStatisticsRecord.numberProgressiveCareUnit = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_progressive_care_unit)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberProgressiveCareUnit == null) {
      serviceStatisticsRecord.numberProgressiveCareUnit = 0;
    }
    if (serviceStatisticsRecord.numberProgressiveCareUnit > 255) {
      serviceStatisticsRecord.numberProgressiveCareUnit = 255;
    }

    serviceStatisticsRecord.numberMissouriPsychiatricCenter = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_missouri_psychiatric_center)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberMissouriPsychiatricCenter == null) {
      serviceStatisticsRecord.numberMissouriPsychiatricCenter = 0;
    }
    if (serviceStatisticsRecord.numberMissouriPsychiatricCenter > 255) {
      serviceStatisticsRecord.numberMissouriPsychiatricCenter = 255;
    }

    serviceStatisticsRecord.numberOther = (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.number_other)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay2 })
        .getRawOne()
    ).sum;
    if (serviceStatisticsRecord.numberOther == null) {
      serviceStatisticsRecord.numberOther = 0;
    }
    if (serviceStatisticsRecord.numberOther > 255) {
      serviceStatisticsRecord.numberOther = 255;
    }

    return serviceStatisticsRecord;
  }

  async updateConsults() {
    try {
      this.consultsRepo.save(this.consults);
    } catch {
      console.log('Failed updating consults');
    }
  }

  async updateEmployeeStatistics() {
    try {
      await this.employeeStatisticRepo.save(this.getEmployeeStatistics());
    } catch {
      console.log('failed updating employee statistics');
    }
    console.log('updated employee statistics');
  }

  async updateServiceStatistics() {
    try {
      await this.serviceStatisticRepo.save(this.getServiceStatistics());
    } catch {
      console.log('failed updating service statistics');
    }
  }

  setConsultsArray(consults: Consult[]) {
    this.consults = consults;
  }

  setEmployeeStatisticsArray(employeeStatistics: EmployeeStatistic[]) {
    this.employeeStatistics = employeeStatistics;
  }

  setServiceStatisticsArray(serviceStatistics: ServiceStatistic[]) {
    this.serviceStatistics = serviceStatistics;
  }

  async getRawDates() {
    const consultsRepo = this.consultsRepo;
    const rawDates = await consultsRepo.createQueryBuilder('consult').select('DISTINCT DATE_FORMAT(consult_date, "%Y%%%m%%%d")').getRawMany();
    return rawDates;
  }

  async FileUpload(req: Request, res: Response) {
    try {
      // this checks to make sure file upload was successful and file was added to request object //

      if (req.file != null) {
        // multer memory storage passes file contents as buffer object //
        // need to decode buffer to UTF-8 string, //
        // then split decoded buffer by newline character to get each row of .csv file //
        // this will produce an array of strings representing each row of .csv file //
        this.clearConsultsArray();
        this.clearEmployeeStatisticsArray();
        this.clearServiceStatisticsArray();

        await this.fetchEmployees();
        await this.fetchConsultTypes();
        await this.fetchLocations();

        await this.clearEmployeeStatistics();
        await this.clearServiceStatistics();

        const file = req.file.buffer;
        const splitByNewLine = file.toString('utf-8').split('\n');
        await this.parseFile(splitByNewLine);
        await this.setConsultIds();
        await this.updateConsults();

        await this.getUpdatedEmployeeStatistics();
        //console.log('got updated employee statistics');
        await this.updateEmployeeStatistics();
        //console.log('updated employee statistics');

        await this.getUpdatedServiceStatistics();
        console.log(this.getServiceStatistics());
        await this.updateServiceStatistics();

        res.send('File successfully uploaded and statistics recalculated.');
      } else {
        console.log('null file');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error uploading file and updating database.', error: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
