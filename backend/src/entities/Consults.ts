import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employees';
import { Location } from './Locations';
import { ConsultTypes } from './ConsultTypes';

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
export class Consults {
  @PrimaryGeneratedColumn()
  id: number;

  // foreign keys //

  @ManyToOne(() => Employee, (employee: Employee) => employee.consult)
  employee: Employee;

  @ManyToOne(() => Employee, (employee: Employee) => employee.consult, { nullable: true })
  asst_employee_id: Employee;

  @ManyToOne(() => Employee, (employee: Employee) => employee.consult, { nullable: true })
  reported_to_id: Employee;

  @ManyToOne(() => Location, (location: Location) => location.consult)
  location: Location;

  @ManyToOne(() => ConsultTypes, (consulttype: ConsultTypes) => consulttype.consult)
  consulttype: ConsultTypes;

  // end relations //

  // non-relational columns //

  @Column({ name: 'consult_date', type: 'timestamp', nullable: false })
  consult_date: Date;

  @Column({ name: 'status', type: 'enum', enum: Status, default: Status.Not_Completed, nullable: false })
  status: Status;

  @Column({ name: 'medications', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  medications: number;

  @Column({ name: 'interventions', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  interventions: number;

  @Column({ name: 'duration', type: 'enum', enum: Duration, nullable: true })
  duration: Duration | null;

  @Column({ name: 'is_admit_orders_placed', type: 'boolean', default: false, nullable: false })
  is_admit_orders_placed: boolean;

  @Column({ name: 'is_intervention_missing', type: 'boolean', default: false, nullable: false })
  is_intervention_missing: boolean;

  @Column({ name: 'is_intervention_not_taking', type: 'boolean', default: false, nullable: false })
  is_intervention_not_taking: boolean;

  @Column({ name: 'is_intervention_incorrect_medication', type: 'boolean', default: false, nullable: false })
  is_intervention_incorrect_medication: boolean;

  @Column({ name: 'is_intervention_incorrect_dose', type: 'boolean', default: false, nullable: false })
  is_intervention_incorrect_dose: boolean;

  @Column({ name: 'is_intervention_incorrect_frequency', type: 'boolean', default: false, nullable: false })
  is_intervention_incorrect_frequency: boolean;

  @Column({ name: 'is_intervention_incorrect_route', type: 'boolean', default: false, nullable: false })
  is_intervention_incorrect_route: boolean;

  @Column({ name: 'is_intervention_allergies_updated', type: 'boolean', default: false, nullable: false })
  is_intervention_allergies_updated: boolean;

  @Column({ name: 'is_intervention_vaccination_documented', type: 'boolean', default: false, nullable: false })
  is_intervention_vaccination_documented: boolean;

  @Column({ name: 'is_request', type: 'boolean', default: false, nullable: false })
  is_request: boolean;
}
