import { ServiceStatistic } from './entities/ServiceStatistic';
import { EmployeeStatistic } from './entities/EmployeeStatistic';
import { Employee } from './entities/Employee';
import { NotBrackets } from 'typeorm';
import { Consult } from './entities/Consult';
import db from './db';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function calculateStatistics() {
  await db.initialize();
  const serviceStatisticRepo = db.getRepository(ServiceStatistic);
  const employeeStatisticRepo = db.getRepository(EmployeeStatistic);
  const employeeRepo = db.getRepository(Employee);
  const consultsRepo = db.getRepository(Consult);

  serviceStatisticRepo.clear();
  employeeStatisticRepo.clear();

  const serviceStatistics: ServiceStatistic[] = [];
  const employeeStatistics: EmployeeStatistic[] = [];

  // get max and min dates //

  const maxDateResult = await consultsRepo.createQueryBuilder('consult').select('MAX(consult.consult_date)').getRawOne();
  const minDateResult = await consultsRepo.createQueryBuilder('consult').select('MIN(consult.consult_date)').getRawOne();

  const maxDate = new Date();
  maxDate.setDate(maxDateResult.consult_date);

  const minDate = new Date();
  minDate.setDate(minDateResult.consult_date);

  const dates: Date[] = await consultsRepo.createQueryBuilder('consult').select('DATE(consult.consult_date)').distinct(true).getRawMany();
  const employees: Employee[] = await employeeRepo.createQueryBuilder('employee').select('employee.id').getMany();

  calculateEmployeeStatistics(dates, employees, employeeStatistics);
  calculateServiceStatistics(dates, serviceStatistics);
}

async function calculateEmployeeStatistics(dates: Date[], employees: Employee[], employeeStatistics: EmployeeStatistic[]) {
  await db.initialize();
  const employeeStatisticRepo = db.getRepository(EmployeeStatistic);

  dates.forEach(function (Date) {
    employees.forEach(function (Employee) {
      calculateDayEmployeeStatistics(Date, Employee, employeeStatistics);
    });
  });
  // insert array into db table //

  await employeeStatisticRepo.save(employeeStatistics);
}

async function calculateDayEmployeeStatistics(day: Date, employee: Employee, employeeStatistics: EmployeeStatistic[]) {
  await db.initialize();

  const consultsRepo = db.getRepository(Consult);

  const employeeStatisticsRecord = new EmployeeStatistic();

  employeeStatisticsRecord.day = day;

  employeeStatisticsRecord.numberConsultNotes = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('consult.date = :date', { date: Date })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.status = :status', { status: 'Completed' })
    .getCount();

  employeeStatisticsRecord.numberAbbreviatedNotes = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('consult.date = :date', { date: Date })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.status = :status', { status: 'Abbreviated' })
    .getCount();

  employeeStatisticsRecord.numberNotes = employeeStatisticsRecord.numberConsultNotes + employeeStatisticsRecord.numberAbbreviatedNotes;

  employeeStatisticsRecord.numberMedications = (
    await consultsRepo
      .createQueryBuilder('consult')
      .select('SUM(consult.number_medications)', 'sum')
      .where('consult.date = :date', { date: Date })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .getRawOne()
  ).sum;

  employeeStatisticsRecord.averageMedicationsPerConsult = employeeStatisticsRecord.numberMedications / employeeStatisticsRecord.numberConsultNotes;

  employeeStatisticsRecord.numberInterventions = (
    await consultsRepo
      .createQueryBuilder('consult')
      .select('SUM(consult.number_interventions)', 'sum')
      .where('consult.date = :date', { date: Date })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .getRawOne()
  ).sum;

  employeeStatisticsRecord.averageInterventionsPerConsult =
    employeeStatisticsRecord.numberInterventions / employeeStatisticsRecord.numberConsultNotes;

  const totalTimeInMinutes = (
    await consultsRepo
      .createQueryBuilder('consult')
      .select('SUM(consult.duration)', 'sum')
      .where('consult.date = :date', { date: Date })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .getRawOne()
  ).sum;

  employeeStatisticsRecord.averageTimePerConsult = totalTimeInMinutes / employeeStatisticsRecord.numberNotes;

  employeeStatisticsRecord.numberRequests = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('consult.date = :date', { date: Date })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.request = :request', { request: true })
    .getCount();

  employeeStatisticsRecord.numberReferredToPharmacist = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('consult.date = :date', { date: Date })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere(new NotBrackets((qb) => qb.where('consult.reported_to_id = :referred', { referred: null })))
    .getCount();

  employeeStatisticsRecord.numberEmergencyRoom = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('consult.date = :date', { date: Date })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '1' })
    .getCount();

  employeeStatisticsRecord.numberIntensiveCareUnit = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('consult.date = :date', { date: Date })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '2' })
    .getCount();

  employeeStatisticsRecord.numberProgressiveCareUnit = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('consult.date = :date', { date: Date })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '3' })
    .getCount();

  employeeStatisticsRecord.numberMissouriPsychiatricCenter = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('consult.date = :date', { date: Date })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '4' })
    .getCount();

  employeeStatisticsRecord.numberOther = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('consult.date = :date', { date: Date })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '5' })
    .getCount();

  // add to employeeStatistics array //

  employeeStatistics.push({ ...employeeStatisticsRecord });
}

async function calculateServiceStatistics(dates: Date[], serviceStatistics: ServiceStatistic[]) {
  await db.initialize();
  const serviceStatisticRepo = db.getRepository(ServiceStatistic);

  dates.forEach(function (Date) {
    calculateDayServiceStatics(Date, serviceStatistics);
  });

  await serviceStatisticRepo.save(serviceStatistics);
}

async function calculateDayServiceStatics(day: Date, serviceStatistics: ServiceStatistic[]) {
  await db.initialize();

  const employeeStatisticRepo = db.getRepository(EmployeeStatistic);

  const serviceStatisticsRecord = new ServiceStatistic();

  serviceStatisticsRecord.day = day;

  serviceStatisticsRecord.numberConsultNotes = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_consult_notes)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberAbbreviatedNotes = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_abbreviated_notes)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberNotes = serviceStatisticsRecord.numberConsultNotes + serviceStatisticsRecord.numberAbbreviatedNotes;

  serviceStatisticsRecord.numberMedications = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_medications)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.averageMedicationsPerConsult = serviceStatisticsRecord.numberMedications / serviceStatisticsRecord.numberConsultNotes;

  serviceStatisticsRecord.numberInterventions = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_interventions)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.averageInterventionsPerConsult = serviceStatisticsRecord.numberInterventions / serviceStatisticsRecord.numberConsultNotes;

  // not precise average time but very close approximation, calculating exact average would require changes to db //

  serviceStatisticsRecord.averageTimePerConsult =
    (
      await employeeStatisticRepo
        .createQueryBuilder('employeeStatistic')
        .select('SUM(employeeStatistic.average_time_per_consult)', 'sum')
        .where('employeeStatistic.day = :date', { date: Date })
        .getRawOne()
    ).sum / serviceStatisticsRecord.numberNotes;

  serviceStatisticsRecord.numberRequests = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_requests)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberReferredToPharmacist = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_referred_to_pharmacist)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberEmergencyRoom = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_emergency_room)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberIntensiveCareUnit = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_intensive_care_unit)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberProgressiveCareUnit = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_progressive_care_unit)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberMissouriPsychiatricCenter = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_missouri_psychiatric_center)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberOther = (
    await employeeStatisticRepo
      .createQueryBuilder('employeeStatistic')
      .select('SUM(employeeStatistic.number_other)', 'sum')
      .where('employeeStatistic.day = :date', { date: Date })
      .getRawOne()
  ).sum;

  // add to serviceStatistics array //

  serviceStatistics.push({ ...serviceStatisticsRecord });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mysqlDateToJavascriptDate(mysqlDate: string) {
  throw new Error('function not yet implemented');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function javascriptDateToMysqlDate(date: Date) {
  throw new Error('function not yet implemented');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mysqlTimestampToJavascriptDate(mysqlTimestamp: string) {
  throw new Error('function not yet implemented');
}
