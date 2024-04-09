import { ServiceStatistic } from './entities/ServiceStatistic';
import { EmployeeStatistic } from './entities/EmployeeStatistic';
import { Employee } from './entities/Employee';
import { NotBrackets } from 'typeorm';
import { Consult } from './entities/Consult';
import db from './db';

export async function calculateStatistics() {
  await db.initialize();
  const serviceStatisticRepo = db.getRepository(ServiceStatistic);
  const employeeStatisticRepo = db.getRepository(EmployeeStatistic);
  const employeeRepo = db.getRepository(Employee);
  const consultsRepo = db.getRepository(Consult);

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

  const employees: Employee[] = await employeeRepo.createQueryBuilder('employee').select('employee.id').getMany();
  calculateEmployeeStatistics(dates, employees, employeeStatistics);
  calculateServiceStatistics(dates, serviceStatistics);
}

export async function calculateEmployeeStatistics(dates: Date[], employees: Employee[], employeeStatistics: EmployeeStatistic[]) {
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

export async function calculateDayEmployeeStatistics(day: Date, employee: Employee, employeeStatistics: EmployeeStatistic[]) {
  await db.initialize();

  const consultsRepo = db.getRepository(Consult);

  const employeeStatisticsRecord = new EmployeeStatistic();

  const mySqlFormattedDay = javascriptDateToMysqlDate(day);

  employeeStatisticsRecord.day = mysqlDateToJavascriptDate(mySqlFormattedDay);

  employeeStatisticsRecord.numberConsultNotes = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.status = :status', { status: 'Completed' })
    .getCount();

  employeeStatisticsRecord.numberAbbreviatedNotes = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.status = :status', { status: 'Abbreviated' })
    .getCount();

  employeeStatisticsRecord.numberNotes = employeeStatisticsRecord.numberConsultNotes + employeeStatisticsRecord.numberAbbreviatedNotes;

  employeeStatisticsRecord.numberMedications = (
    await consultsRepo
      .createQueryBuilder('consult')
      .select('SUM(consult.medications)', 'sum')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .getRawOne()
  ).sum;

  employeeStatisticsRecord.averageMedicationsPerConsult = employeeStatisticsRecord.numberMedications / employeeStatisticsRecord.numberConsultNotes;

  employeeStatisticsRecord.numberInterventions = (
    await consultsRepo
      .createQueryBuilder('consult')
      .select('SUM(consult.interventions)', 'sum')
      .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
      .andWhere('consult.employee = :employee', { employee: employee.id })
      .getRawOne()
  ).sum;

  employeeStatisticsRecord.averageInterventionsPerConsult =
    employeeStatisticsRecord.numberInterventions / employeeStatisticsRecord.numberConsultNotes;

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

  employeeStatisticsRecord.averageTimePerConsult = totalTimeInMinutes / employeeStatisticsRecord.numberNotes;

  employeeStatisticsRecord.numberRequests = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.is_request = :request', { request: true })
    .getCount();

  employeeStatisticsRecord.numberReferredToPharmacist = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere(new NotBrackets((qb) => qb.where('consult.reported_to_id = :referred', { referred: null })))
    .getCount();

  employeeStatisticsRecord.numberEmergencyRoom = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '1' })
    .getCount();

  employeeStatisticsRecord.numberIntensiveCareUnit = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '2' })
    .getCount();

  employeeStatisticsRecord.numberProgressiveCareUnit = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '3' })
    .getCount();

  employeeStatisticsRecord.numberMissouriPsychiatricCenter = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '4' })
    .getCount();

  employeeStatisticsRecord.numberOther = await consultsRepo
    .createQueryBuilder('consult')
    .select('consult')
    .where('(DATE_FORMAT(DATE(consult.consult_date), "%Y%m%d")) = :date', { date: mySqlFormattedDay })
    .andWhere('consult.employee = :employee', { employee: employee.id })
    .andWhere('consult.location = :location', { location: '5' })
    .getCount();

  // add to employeeStatistics array //

  employeeStatistics.push({ ...employeeStatisticsRecord });
}

export async function calculateServiceStatistics(dates: Date[], serviceStatistics: ServiceStatistic[]) {
  await db.initialize();
  const serviceStatisticRepo = db.getRepository(ServiceStatistic);

  dates.forEach(function (Date) {
    calculateDayServiceStatics(Date, serviceStatistics);
  });

  await serviceStatisticRepo.save(serviceStatistics);
}

export async function calculateDayServiceStatics(day: Date, serviceStatistics: ServiceStatistic[]) {
  await db.initialize();

  const employeeStatisticRepo = db.getRepository(EmployeeStatistic);

  const serviceStatisticsRecord = new ServiceStatistic();

  const mySqlFormattedDay = javascriptDateToMysqlDate2(day);

  serviceStatisticsRecord.day = mysqlDateToJavascriptDate(mySqlFormattedDay);

  serviceStatisticsRecord.numberConsultNotes = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_consult_notes)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberAbbreviatedNotes = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_abbreviated_notes)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  const numConsultNotes = serviceStatisticsRecord.numberConsultNotes.valueOf();
  const numAbbreviatedNotes = serviceStatisticsRecord.numberAbbreviatedNotes.valueOf();
  serviceStatisticsRecord.numberNotes = +numConsultNotes + +numAbbreviatedNotes;

  serviceStatisticsRecord.numberMedications = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_medications)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.averageMedicationsPerConsult = serviceStatisticsRecord.numberMedications / serviceStatisticsRecord.numberConsultNotes;

  serviceStatisticsRecord.numberInterventions = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_interventions)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.averageInterventionsPerConsult = serviceStatisticsRecord.numberInterventions / serviceStatisticsRecord.numberConsultNotes;

  const numRecords = await employeeStatisticRepo
    .createQueryBuilder('employee_statistics')
    .select()
    .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
    .getCount();

  serviceStatisticsRecord.averageTimePerConsult =
    (
      await employeeStatisticRepo
        .createQueryBuilder('employee_statistics')
        .select('SUM(employee_statistics.average_time_per_consult)', 'sum')
        .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
        .getRawOne()
    ).sum / numRecords;

  serviceStatisticsRecord.numberRequests = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_requests)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberReferredToPharmacist = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_referred_to_pharmacist)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberEmergencyRoom = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_emergency_room)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberIntensiveCareUnit = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_intensive_care_unit)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberProgressiveCareUnit = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_progressive_care_unit)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberMissouriPsychiatricCenter = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_missouri_psychiatric_center)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  serviceStatisticsRecord.numberOther = (
    await employeeStatisticRepo
      .createQueryBuilder('employee_statistics')
      .select('SUM(employee_statistics.number_other)', 'sum')
      .where('employee_statistics.day = :date', { date: mySqlFormattedDay })
      .getRawOne()
  ).sum;

  // add to serviceStatistics array //

  serviceStatistics.push({ ...serviceStatisticsRecord });
}

export function javascriptDateToMysqlDate(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();
  const day = (date.getDate() + 1).toString();
  if (month.length == 1) {
    month.padStart(2, '0');
  }
  if (day.length == 1) {
    day.padStart(2, '0');
  }
  const mysqlDate = year.concat(month, day);
  return mysqlDate;
}

export function javascriptDateToMysqlDate2(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();
  const day = (date.getDate() + 1).toString();
  if (month.length == 1) {
    month.padStart(2, '0');
  }
  if (day.length == 1) {
    day.padStart(2, '0');
  }
  const mysqlDate = year.concat('-', month, '-', day);
  return mysqlDate;
}

export function mysqlDateToJavascriptDate(date: string) {
  const dateObject = new Date(date);
  return dateObject;
}
