export enum Role {
  EMPLOYEE = 'employee',
  SUPERVISOR = 'supervisor'
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
