import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';

@Entity('employee_statistics')
export class EmployeeStatistic {
  @PrimaryColumn({ name: 'day', type: 'date' })
  day: Date;

  @PrimaryColumn({ name: 'employee_id', type: 'int' })
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'number_notes', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberNotes: number;

  @Column({ name: 'number_consult_notes', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberConsultNotes: number;

  @Column({ name: 'number_abbreviated_notes', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberAbbreviatedNotes: number;

  @Column({ name: 'number_medications', type: 'smallint', unsigned: true, default: 0, nullable: false })
  numberMedications: number;

  @Column({ name: 'average_medications_per_consult', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  averageMedicationsPerConsult: number;

  @Column({ name: 'number_interventions', type: 'smallint', unsigned: true, default: 0, nullable: false })
  numberInterventions: number;

  @Column({ name: 'average_interventions_per_consult', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  averageInterventionsPerConsult: number;

  @Column({ name: 'average_time_per_consult', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  averageTimePerConsult: number;

  @Column({ name: 'number_requests', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberRequests: number;

  @Column({ name: 'number_emergency_room', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberEmergencyRoom: number;

  @Column({ name: 'number_intensive_care_unit', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberIntensiveCareUnit: number;

  @Column({ name: 'number_progressive_care_unit', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberProgressiveCareUnit: number;

  @Column({ name: 'number_missouri_psychiatric_center', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberMissouriPsychiatricCenter: number;

  @Column({ name: 'number_other', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberOther: number;

  @Column({ name: 'number_referred_to_pharmacist', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  numberReferredToPharmacist: number;
}
