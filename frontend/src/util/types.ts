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

export interface EmployeeStatistic {
  employee_id: number;
  day: Date;
  number_notes: number;
  number_consult_notes: number;
  number_abbreviated_notes: number;
  number_medications: number;
  average_medications_per_consult: number;
  number_intervention: number;
  average_interventions_per_consult: number;
  average_time_per_consult: number;
  number_requests: number;
  number_emergency_room: number;
  number_intensive_care_unit: number;
  number_progressive_care_unit: number;
  number_missouri_psychiatric_center: number;
  number_other: number;
  number_referred_to_pharmacist: number;
}

export interface ServiceStatistic {
  day: Date;
  number_notes: number;
  number_consult_notes: number;
  number_abbreviated_notes: number;
  number_medications: number;
  average_medications_per_consult: number;
  number_interventions: number;
  average_interventions_per_consult: number;
  average_time_per_consult: number;
  number_requests: number;
  number_emergency_room: number;
  number_intensive_care_unit: number;
  number_progressive_care_unit: number;
  number_missouri_psychiatric_center: number;
  number_other: number;
  number_referred_to_pharmacist: number;
}
