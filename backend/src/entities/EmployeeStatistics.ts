import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employees';

@Entity('employee_statistics')
export class EmployeeStatistics {
  @PrimaryColumn({ name: 'day', type: 'date' })
  day: Date;

  @PrimaryColumn()
  employee_id: number;
  @ManyToOne(() => Employee, (employee: Employee) => employee.employeestatistics)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'number_notes', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_notes: number;

  @Column({ name: 'number_consult_notes', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_consult_notes: number;

  @Column({ name: 'number_abbreviated_notes', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_abbreviated_notes: number;

  @Column({ name: 'number_medications', type: 'smallint', unsigned: true, default: 0, nullable: false })
  number_medications: number;

  @Column({ name: 'average_medications_per_consult', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  average_medications_per_consult: number;

  @Column({ name: 'number_interventions', type: 'smallint', unsigned: true, default: 0, nullable: false })
  number_interventions: number;

  @Column({ name: 'average_interventions_per_consult', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  average_interventions_per_consult: number;

  @Column({ name: 'average_time_per_consult', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  average_time_per_consult: number;

  @Column({ name: 'number_requests', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_requests: number;

  @Column({ name: 'number_emergency_room', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_emergency_room: number;

  @Column({ name: 'number_intensive_care_unit', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_intensive_care_unit: number;

  @Column({ name: 'number_progressive_care_unit', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_progressive_care_unit: number;

  @Column({ name: 'number_missouri_psychiatric_center', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_missouri_psychiatric_center: number;

  @Column({ name: 'number_other', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_other: number;

  @Column({ name: 'number_referred_to_pharmacist', type: 'tinyint', unsigned: true, default: 0, nullable: false })
  number_referred_to_pharmacist: number;
}
