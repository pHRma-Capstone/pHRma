import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';
import { Location } from './Location';
import { ConsultType } from './ConsultType';

export enum Duration {
  One = '<1 Minute',
  Five = '1-5 Minutes',
  Fifteen = '6-15 Minutes',
  Thirty = '16-30 Minutes',
  Sixty = '31-60 Minutes',
  Ninety = '>1 Hour'
}

export enum Status {
  Not_Completed = 'Not Completed',
  Abbreviated = 'Abbreviated',
  In_Progress = 'In-Progress',
  Investigating = 'Investigating',
  Completed = 'Completed'
}

@Entity('consults')
export class Consult {
  @PrimaryGeneratedColumn()
  id: number;

  // foreign keys //

  @ManyToOne(() => Employee, (employee: Employee) => employee.id)
  employee: Employee;

  @ManyToOne(() => Employee, (employee: Employee) => employee.id, { nullable: true })
  asstEmployeeId: Employee;

  @ManyToOne(() => Employee, (employee: Employee) => employee.id, { nullable: true })
  reportedToId: Employee;

  @ManyToOne(() => Location, (location: Location) => location.consult)
  location: Location;

  @ManyToOne(() => ConsultType, (consulttype: ConsultType) => consulttype.consult)
  consultType: ConsultType;

  // end relations //

  // non-relational columns //

  @Column({ name: 'consult_date', type: 'timestamp', nullable: false })
  consultDate: Date;

  @Column({ name: 'status', type: 'enum', enum: Status, default: Status.Not_Completed, nullable: false })
  status: Status;

  @Column({ name: 'medications', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  medications: number;

  @Column({ name: 'interventions', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  interventions: number;

  @Column({ name: 'duration', type: 'enum', enum: Duration, nullable: true })
  duration: Duration | null;

  @Column({ name: 'is_admit_orders_placed', type: 'boolean', default: false, nullable: false })
  isAdmitOrdersPlaced: boolean;

  @Column({ name: 'is_intervention_missing', type: 'boolean', default: false, nullable: false })
  isInterventionMissing: boolean;

  @Column({ name: 'is_intervention_not_taking', type: 'boolean', default: false, nullable: false })
  isInterventionNotTaking: boolean;

  @Column({ name: 'is_intervention_incorrect_medication', type: 'boolean', default: false, nullable: false })
  isInterventionIncorrectMedication: boolean;

  @Column({ name: 'is_intervention_incorrect_dose', type: 'boolean', default: false, nullable: false })
  isInterventionIncorrectDose: boolean;

  @Column({ name: 'is_intervention_incorrect_frequency', type: 'boolean', default: false, nullable: false })
  isInterventionIncorrectFrequency: boolean;

  @Column({ name: 'is_intervention_incorrect_route', type: 'boolean', default: false, nullable: false })
  isInterventionIncorrectRoute: boolean;

  @Column({ name: 'is_intervention_allergies_updated', type: 'boolean', default: false, nullable: false })
  isInterventionAllergiesUpdated: boolean;

  @Column({ name: 'is_intervention_vaccination_documented', type: 'boolean', default: false, nullable: false })
  isInterventionVaccinationDocumented: boolean;

  @Column({ name: 'is_request', type: 'boolean', default: false, nullable: false })
  isRequest: boolean;
}
