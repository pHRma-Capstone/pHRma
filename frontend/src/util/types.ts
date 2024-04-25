export enum Role {
  EMPLOYEE = 'employee',
  SUPERVISOR = 'supervisor'
}

// can also add max/min
export enum Calculation {
  AVG = 'average',
  MEDIAN = 'median',
  MAX = 'max',
  MIN = 'min'
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  isMedHistoryTechnician: boolean;
  isMedHistoryIntern: boolean;
  isPharmacist: boolean;
  shiftSchedule: number | null;
}

export interface EmployeeStatistic {
  employeeId: number;
  day: Date;
  numberNotes: number;
  numberConsultNotes: number;
  numberAbbreviatedNotes: number;
  numberMedications: number;
  averageMedicationsPerConsult: number;
  numberInterventions: number;
  averageInterventionsPerConsult: number;
  averageTimePerConsult: number;
  numberRequests: number;
  numberEmergencyRoom: number;
  numberIntensiveCareUnit: number;
  numberProgressiveCareUnit: number;
  numberMissouriPsychiatricCenter: number;
  numberOther: number;
  numberReferredToPharmacist: number;
}

export interface ServiceStatistic {
  day: Date;
  numberNotes: number;
  numberConsultNotes: number;
  numberAbbreviatedNotes: number;
  numberMedications: number;
  averageMedicationsPerConsult: number;
  numberInterventions: number;
  averageInterventionsPerConsult: number;
  averageTimePerConsult: number;
  numberRequests: number;
  numberEmergencyRoom: number;
  numberIntensiveCareUnit: number;
  numberProgressiveCareUnit: number;
  numberMissouriPsychiatricCenter: number;
  numberOther: number;
  numberReferredToPharmacist: number;
}

export type SelectableServiceStatistic = Exclude<keyof ServiceStatistic, 'day'>;

export type SelectableEmployeeStatistic = Exclude<keyof EmployeeStatistic, 'day' | 'employeeId'>;
