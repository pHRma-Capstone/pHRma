import { EmployeeStatistic } from '../entities/EmployeeStatistic';
import db from '../db';

// TO RUN THIS SCRIPT
// npm run seed -- ./src/seeds/employeeStatistics.ts

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEmployeeStatisticsRecordsForLastYear(): EmployeeStatistic[] {
  const records: EmployeeStatistic[] = [];

  for (let empId = 1; empId < 14; empId++) {
    const endDate = new Date();
    const startDate = new Date(new Date().setFullYear(endDate.getFullYear() - 1));

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const record = new EmployeeStatistic();
      record.day = new Date(d); // Use the current date in the loop
      record.employeeId = empId;
      record.numberNotes = getRandomInt(0, 100);
      record.numberConsultNotes = getRandomInt(0, 50);
      record.numberAbbreviatedNotes = getRandomInt(0, 50);
      record.numberMedications = getRandomInt(0, 200);
      record.averageMedicationsPerConsult = getRandomInt(0, 10);
      record.numberInterventions = getRandomInt(0, 100);
      record.averageInterventionsPerConsult = getRandomInt(0, 5);
      record.averageTimePerConsult = getRandomInt(5, 60); // Assuming time in minutes
      record.numberRequests = getRandomInt(0, 100);
      record.numberEmergencyRoom = getRandomInt(0, 50);
      record.numberIntensiveCareUnit = getRandomInt(0, 30);
      record.numberProgressiveCareUnit = getRandomInt(0, 20);
      record.numberMissouriPsychiatricCenter = getRandomInt(0, 10);
      record.numberOther = getRandomInt(0, 50);
      record.numberReferredToPharmacist = getRandomInt(0, 40);

      records.push({ ...record, day: new Date(record.day) });
    }
  }

  return records;
}

async function seedRandomEmployeeStatistics() {
  await db.initialize();
  const employeeStatisticRepo = db.getRepository(EmployeeStatistic);

  await employeeStatisticRepo.clear();
  const randomRecords = generateEmployeeStatisticsRecordsForLastYear();
  console.log(`Starting save of ${randomRecords.length} records.`);
  await employeeStatisticRepo.save(randomRecords);
  console.log('Random EmployeeStatistics records have been generated and saved.');
}

seedRandomEmployeeStatistics()
  .then(() => process.exit(0))
  .catch((error) => console.log('Error seeding data:', error));
