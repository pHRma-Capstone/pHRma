import { ServiceStatistic } from '../entities/ServiceStatistic';
import db from '../db';

// TO RUN THIS SCRIPT
// npm run seed -- ./src/seeds/serviceStatistics.ts

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateServiceStatisticsRecordsForLastYear(): ServiceStatistic[] {
  const records: ServiceStatistic[] = [];
  const endDate = new Date();
  const startDate = new Date(new Date().setFullYear(endDate.getFullYear() - 1));

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const record = new ServiceStatistic();
    record.day = new Date(d); // Use the current date in the loop
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

  endDate.setDate(endDate.getDate() - 1);

  return records;
}

async function seedRandomServiceStatistics() {
  await db.initialize();
  const serviceStatisticRepo = db.getRepository(ServiceStatistic);

  serviceStatisticRepo.clear();
  const randomRecords = generateServiceStatisticsRecordsForLastYear();
  await serviceStatisticRepo.save(randomRecords);
  console.log('Random ServiceStatistics records have been generated and saved.');
}

seedRandomServiceStatistics()
  .then(() => process.exit(0))
  .catch((error) => console.log('Error seeding data:', error));
