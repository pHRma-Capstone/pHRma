import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employees';

export enum PTO_Type {
  PTO = 'PTO',
  Personal = 'Personal',
  Vacation = 'Vacation',
  Sick = 'Sick'
}

@Entity('exception_log')
export class ExceptionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee: Employee) => employee.exceptionlog)
  employee: Employee;

  @Column({ name: 'exception_date', type: 'date', nullable: false })
  exception_date: Date;

  @Column({ name: 'missed_punch_in', type: 'boolean', default: 'false', nullable: false })
  missed_punch_in: boolean;

  @Column({ name: 'in_time', type: 'timestamp', nullable: true })
  in_time: Date | null;

  @Column({ name: 'missed_punch_lunch_in', type: 'boolean', default: 'false', nullable: false })
  missed_punch_lunch_in: boolean;

  @Column({ name: 'lunch_in_time', type: 'timestamp', nullable: true })
  lunch_in_time: Date | null;

  @Column({ name: 'missed_punch_lunch_out', type: 'boolean', default: 'false', nullable: false })
  missed_punch_lunch_out: boolean;

  @Column({ name: 'lunch_out_time', type: 'timestamp', nullable: true })
  lunch_out_time: Date | null;

  @Column({ name: 'missed_punch_out', type: 'boolean', default: 'false', nullable: false })
  missed_punch_out: boolean;

  @Column({ name: 'out_time', type: 'timestamp', nullable: true })
  out_time: Date | null;

  @Column({ name: 'is_signed_employee', type: 'boolean', default: 'false', nullable: false })
  is_signed_employee: boolean;

  @Column({ name: 'is_signed_supervisor', type: 'boolean', default: 'false', nullable: false })
  is_signed_supervisor: boolean;

  @Column({ name: 'reason', type: 'varchar', length: 100, nullable: true })
  reason: string | null;

  @Column({ name: 'hours_time_off', type: 'decimal', precision: 4, scale: 2, nullable: true })
  hours_time_off: number | null;

  @Column({ name: 'time_off_type', type: 'enum', enum: PTO_Type, nullable: true })
  time_off_type: PTO_Type | null;
}
